"use client";

import React, { useState } from "react";
import skyAnimation from "../public/sky.json";
import { AttestationShareablePackageObject, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import Lottie from "lottie-react";
import tw from "tailwind-styled-components";
import { AttestationCard } from "~~/components/AttestationCard";
import { RecentAttestationsView } from "~~/components/RecentAttestationsView";
import { Spinner } from "~~/components/assets/Spinner";
import { submitSignedAttestation } from "~~/utils/utils";

type Validity = "true" | "false" | "misleading" | "invalid" | "unsure";

const Container = tw.div`
  min-h-screen 
  w-full 
  relative 
  overflow-hidden
`;

const AnimationWrapper = tw.div`
  absolute 
  inset-0 
  w-full 
  h-full
`;

const Overlay = tw.div`
  absolute 
  inset-0 
  bg-black 
  bg-opacity-50
`;

const ContentWrapper = tw.div`
  relative 
  z-10 
  min-h-screen 
  w-full 
  flex
  flex-col 
  justify-center 
  items-center 
  p-4
`;

const Card = tw.div`
  bg-gray-800 
  bg-opacity-95 
  rounded-2xl 
  shadow-2xl 
  p-8 
  w-11/12 
  max-w-md 
  backdrop-blur-sm
  mb-6
  mt-6
`;

const Title = tw.h2`
  text-3xl 
  font-extrabold 
  mb-6 
  text-center 
  text-white
`;

const TitleSpan = tw.span`
  text-indigo-400
`;

const TextArea = tw.textarea`
  w-full 
  bg-gray-700 
  rounded-lg 
  p-4 
  mb-4 
  text-white 
  focus:ring-2 
  focus:ring-indigo-500 
  focus:outline-none 
  transition-all 
  duration-300 
  ease-in-out
`;

const StatementDisplay = tw.div`
  mb-6 
  p-4 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const StatementTitle = tw.h3`
  font-bold 
  mb-2 
  text-xl 
  text-indigo-300
`;

const StatementText = tw.p`
  text-gray-300
`;

const ResponseWrapper = tw.div`
  mt-6 
  p-6 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const ResponseTitle = tw.h3`
  font-bold 
  mb-4 
  text-xl 
  text-indigo-300
`;

const ResponseValidity = tw.p`
  font-semibold 
  text-2xl 
  mb-4 
  capitalize
`;

const ResponseCritique = tw.p`
  text-gray-300 
  leading-relaxed
`;

const ButtonWrapper = tw.div<{ $hasResult: boolean }>`
  flex 
  space-x-4 
  ${p => (p.$hasResult ? "mt-6" : "")}
`;

const Button = tw.button<{ $isPublish?: boolean }>`
  flex-1 
  ${p => (p.$isPublish ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600")}
  text-white 
  font-bold 
  py-3 
  px-6 
  rounded-lg 
  transition-colors 
  duration-300 
  ease-in-out 
  transform 
  hover:scale-105 
  focus:outline-none 
  focus:ring-2 
  ${p => (p.$isPublish ? "focus:ring-green-500" : "focus:ring-indigo-500")}
  focus:ring-opacity-50
`;

const Disclaimer = tw.p`
  text-xs 
  text-gray-400 
  mt-6 
  text-center
`;

const TruthVerifier = () => {
  const [statement, setStatement] = useState("");
  const [result, setResult] = useState<AttestationShareablePackageObject | null>(null);
  const [response, setResponse] = useState<{ critique: string; validity: Validity } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.MouseEvent) => {
    if (result) {
      setResult(null);
      setResponse(null);
      setStatement("");
      return;
    }

    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/verify-truth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statement }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const pkg: AttestationShareablePackageObject = data.result;

      setResult(pkg);

      const schemaEncoder = new SchemaEncoder(
        "string requestedTextToVerify,string model,string validity,string critique",
      );

      const decoded = schemaEncoder.decodeData(pkg.sig.message.data);

      setResponse({
        validity: decoded[2].value.value as Validity,
        critique: decoded[3].value.value as string,
      });
      console.log("Decoded:", decoded);
    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    if (result) {
      await submitSignedAttestation(result);

      window.location.reload();
    } else {
      alert("No result to publish.");
    }
    setIsPublishing(false);
  };

  return (
    <Container>
      <AnimationWrapper>
        <Lottie
          animationData={skyAnimation}
          style={{
            position: "absolute",
            width: "100%",
            height: "1700",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(1)",
          }}
        />
      </AnimationWrapper>
      <Overlay />
      <ContentWrapper>
        <Card>
          <Title>
            Is that <TitleSpan>TRUE</TitleSpan>?
          </Title>
          <div className="space-y-4">
            {!result ? (
              <TextArea
                rows={4}
                placeholder="Type in any statement you want to verify if it's true or not. I will analyze it and attest to the result."
                value={statement}
                onChange={e => setStatement(e.target.value)}
              />
            ) : (
              <StatementDisplay>
                <StatementTitle>Your statement:</StatementTitle>
                <StatementText>{statement}</StatementText>
              </StatementDisplay>
            )}
          </div>
          {response && (
            <ResponseWrapper>
              <ResponseTitle>LLM Says:</ResponseTitle>
              <ResponseValidity>{response.validity}</ResponseValidity>
              <ResponseCritique>{response.critique}</ResponseCritique>
            </ResponseWrapper>
          )}
          {result && (
            <div className="mt-6">
              <AttestationCard pkg={result} hideVote={true} />
            </div>
          )}
          <ButtonWrapper $hasResult={!!result}>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Spinner />
                  <span className={"ml-2"}>Verifying...</span>
                </span>
              ) : result ? (
                "Start Over"
              ) : (
                "Tell me the Truth"
              )}
            </Button>
            {result && (
              <Button $isPublish onClick={handlePublish} disabled={isPublishing === true}>
                {isPublishing ? (
                  <span className="flex items-center justify-center">
                    <Spinner />
                    <span className={"ml-2"}>Publishing...</span>
                  </span>
                ) : (
                  "Publish Result"
                )}
              </Button>
            )}
          </ButtonWrapper>

          <Disclaimer>
            *This is an example open-source repo using EAS & OpenAI.
            <br />
            Results are for example purposes only.
          </Disclaimer>
        </Card>

        <RecentAttestationsView />
      </ContentWrapper>
    </Container>
  );
};

export default TruthVerifier;
