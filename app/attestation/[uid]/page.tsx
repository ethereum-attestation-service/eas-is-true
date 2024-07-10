"use client";

import React, { useEffect, useState } from "react";
import { AttestationShareablePackageObject, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import Lottie from "lottie-react";
import tw from "tailwind-styled-components";
import { AttestationCard } from "~~/components/AttestationCard";
import skyAnimation from "~~/public/sky.json";

interface AttestationPageProps {
  params: { uid: string };
}

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

const StatementWrapper = tw.div`
  mb-6 
  p-4 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const SectionTitle = tw.h3`
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

const ResponseValidity = tw.p`
  font-semibold 
  text-2xl 
  mb-4 
  first-letter:uppercase
`;

const ResponseCritique = tw.p`
  text-gray-300 
  leading-relaxed
`;

const Disclaimer = tw.p`
  text-xs 
  text-gray-400 
  mt-6 
  text-center
`;

const LoadingWrapper = tw.div`
  min-h-screen 
  w-full 
  flex 
  justify-center 
  items-center
`;

const LoadingText = tw.div`
  text-white 
  text-2xl
`;

export default function AttestationPage({ params }: AttestationPageProps) {
  const [attestation, setAttestation] = useState<AttestationShareablePackageObject | null>(null);
  const { uid } = params;

  useEffect(() => {
    fetchAttestationBasedOnUID(uid).then(data => {
      if (data) {
        setAttestation(JSON.parse(data.data));
      }
    });
  }, [uid]);

  if (!attestation) {
    return (
      <LoadingWrapper>
        <LoadingText>Loading...</LoadingText>
      </LoadingWrapper>
    );
  }

  const schemaEncoder = new SchemaEncoder("string requestedTextToVerify,string model,string validity,string critique");

  const decoded = schemaEncoder.decodeData(attestation.sig.message.data);

  return (
    <Container>
      <AnimationWrapper>
        <Lottie
          animationData={skyAnimation}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(3)",
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
            <StatementWrapper>
              <SectionTitle>Your statement:</SectionTitle>
              <StatementText>{decoded[0].value.value as string}</StatementText>
            </StatementWrapper>
          </div>

          <ResponseWrapper>
            <SectionTitle>LLM Says:</SectionTitle>
            <ResponseValidity>{decoded[2].value.value as string}</ResponseValidity>
            <ResponseCritique>{decoded[3].value.value as string}</ResponseCritique>
          </ResponseWrapper>

          <div className="mt-6">
            <AttestationCard pkg={attestation} />
          </div>

          <Disclaimer>
            *This is an example open-source repo using EAS & OpenAI.
            <br />
            Results are for example purposes only.
          </Disclaimer>
        </Card>
      </ContentWrapper>
    </Container>
  );
}

async function fetchAttestationBasedOnUID(uid: string) {
  const query = `
    query ExampleQuery($where: AttestationWhereUniqueInput!) {
      attestation(where: $where) {
        id
        data
      }
    }
  `;

  const variables = {
    where: {
      id: uid,
    },
  };

  try {
    const response = await fetch("https://sepolia.easscan.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.attestation;
  } catch (error) {
    console.error("Error fetching attestation:", error);
    return null;
  }
}
