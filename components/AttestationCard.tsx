import React, { useState } from "react";
import {
  AttestationShareablePackageObject,
  EAS,
  SchemaEncoder,
  createOffchainURL,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import tw from "tailwind-styled-components";
import { Checkmark } from "~~/components/assets/Checkmark";
import { Spinner } from "~~/components/assets/Spinner";
import { submitSignedAttestation } from "~~/utils/utils";
import { useSigner } from "~~/utils/wagmi-utils";

const Card = tw.div`
  mt-6 
  rounded-lg 
  overflow-hidden
`;

const Header = tw.div`
  bg-info
  px-4 
  py-2 
  flex 
  items-center
`;

const Title = tw.h3`
  font-bold 
  text-lg 
  text-white 
  mb-0
`;

const Content = tw.div`
  p-3 
  space-y-3 
  bg-gray-700
`;

const Label = tw.p`
  text-sm 
  text-gray-400 
  mb-1 
  mt-0
`;

const Value = tw.p`
  font-mono 
  text-xs 
  break-all 
  bg-gray-800 
  p-2 
  rounded 
  text-gray-300 
  mt-0
`;

const Link = tw.a`
  block 
  text-indigo-400 
  hover:text-indigo-300 
  transition-colors 
  duration-300 
  underline 
  text-sm 
  cursor-pointer
`;

const Footer = tw.div`
  bg-info
  px-4 
  py-2 
  flex 
  justify-between 
  items-center
  rounded-b-lg
`;

const FooterText = tw.span`
  text-xs 
  text-indigo-200
`;

const VoteButton = tw.button`
  px-4 
  py-2 
  rounded 
  font-bold 
  text-white 
  transition-all 
  duration-300 
  ease-in-out 
  focus:outline-none 
  focus:ring-2 
  focus:ring-opacity-50 
  hover:scale-105
  flex
  align-center
  justify-center
`;

const UpvoteButton = tw(VoteButton)`
  bg-teal-600 
  hover:bg-teal-700 
  focus:ring-teal-500
`;

const DownvoteButton = tw(VoteButton)`
  bg-amber-600 
  hover:bg-amber-700 
  focus:ring-amber-500
`;

const ButtonContainer = tw.div`
  flex 
  justify-center 
  space-x-4 
  mt-4
`;

const handleAttestationClick = (result: AttestationShareablePackageObject) => {
  const url = createOffchainURL(result);
  window.open(`https://sepolia.easscan.org${url}`, "_blank");
};

function isAttestationShareablePackageObject(pkg: any): pkg is AttestationShareablePackageObject {
  return "signer" in pkg && "message" in pkg.sig;
}

type Props = {
  pkg: AttestationShareablePackageObject | { sig: { uid: string }; signer: string };
  hideVote?: boolean;
};

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

export const AttestationCard = ({ pkg, hideVote }: Props) => {
  const [isVoting, setIsVoting] = useState<"upvote" | "downvote" | null>(null);
  const signer = useSigner();

  const handleVote = async (upvote: boolean) => {
    const voteType = upvote ? "upvote" : "downvote";

    setIsVoting(voteType);
    try {
      console.log("signer", signer);
      if (!signer) {
        throw new Error("No signer available.");
      }

      const eas = new EAS(EASContractAddress, { signer });

      const offchain = await eas.getOffchain();

      const schemaEncoder = new SchemaEncoder("bool upVote");
      const encodedData = schemaEncoder.encodeData([{ name: "upVote", value: upvote, type: "bool" }]);

      const sig = await offchain.signOffchainAttestation(
        {
          schema: "0x30b32d5102c39d482689d1b8747d236dde4871a10cd8048e8fea721e956a7979",
          data: encodedData,
          recipient: ethers.ZeroAddress,
          expirationTime: 0n,
          revocable: true,
          time: BigInt(Math.floor(Date.now() / 1000)),
          refUID: pkg.sig.uid,
        },
        signer,
      );

      await submitSignedAttestation({ sig, signer: signer.address });

      alert("Vote submitted successfully!");
    } catch (error) {
      console.error("Error while voting:", error);
      alert("Error while submitting vote. Please try again.");
    } finally {
      setIsVoting(null);
    }
  };

  return (
    <Card>
      <Header>
        <Title>EAS Attestation</Title>
      </Header>
      <Content>
        <div>
          <Label>Attestation UID:</Label>
          <Value>{pkg.sig.uid}</Value>
        </div>
        <div>
          {isAttestationShareablePackageObject(pkg) ? (
            <Link onClick={() => handleAttestationClick(pkg)} target="_blank" rel="noopener noreferrer">
              View Attestation Details
            </Link>
          ) : (
            <Link target="_blank" href={`https://sepolia.easscan.org/offchain/attestation/view/${pkg.sig.uid}`}>
              View Attestation Details
            </Link>
          )}
        </div>
      </Content>
      <Footer>
        <FooterText>Verified by EAS</FooterText>
        <Checkmark className={"text-indigo-200"} />
      </Footer>
      {!hideVote && (
        <ButtonContainer>
          <DownvoteButton onClick={() => handleVote(false)} disabled={isVoting !== null}>
            {isVoting === "downvote" ? <Spinner /> : "Downvote"}
          </DownvoteButton>
          <UpvoteButton onClick={() => handleVote(true)} disabled={isVoting !== null}>
            {isVoting === "upvote" ? <Spinner /> : "Upvote"}
          </UpvoteButton>
        </ButtonContainer>
      )}
    </Card>
  );
};
