import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { AttestationCard } from "~~/components/AttestationCard";
import { Spinner } from "~~/components/assets/Spinner";

interface Attestation {
  id: string;
  attester: string;
  decodedDataJson: string;
  time: string;
}

interface DecodedData {
  name: string;
  type: string;
  signature: string;
  value: {
    name: string;
    type: string;
    value: string;
  };
}

const AttestationList = tw.div`
  w-full 
  max-w-3xl 
  space-y-6
`;

const AttestationItem = tw.div`
  bg-gray-800 
  bg-opacity-95 
  rounded-2xl 
  shadow-2xl 
  p-6 
  backdrop-blur-sm
`;

const Title = tw.h1`
  text-3xl 
  font-extrabold 
  mb-6 
  text-center 
  text-white 
  mt-4
`;

const StatementText = tw.p`
  text-xl 
  font-semibold 
  text-white 
  mb-4
  mt-0
`;

const ValidityText = tw.p`
  text-lg 
  font-medium 
  mb-2
  text-white

`;

const CritiqueText = tw.p`
  text-gray-300 
  mb-4
`;

const TimeText = tw.p`
  text-sm 
  text-gray-400
`;

const LoadingWrapper = tw.div`
  flex 
  justify-center 
  items-center 
  h-64
`;

export function RecentAttestationsView() {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseDecodedData = (decodedDataJson: string): Record<string, string> => {
    const parsedData: DecodedData[] = JSON.parse(decodedDataJson);
    return parsedData.reduce((acc, item) => {
      acc[item.name] = item.value.value;
      return acc;
    }, {} as Record<string, string>);
  };

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const response = await fetch("https://sepolia.easscan.org/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetAttestations {
                attestations(
                  where: {
                    schemaId: {
                      equals: "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd"
                    },
                    attester: {
                      equals: "0x0fB2FA8306F661E31C7BFE76a5fF3A3F85a9f9A2"
                    }
                  }
                  orderBy: [{ time: desc }],
                  take: 20
                ) {
                  attester
                  decodedDataJson
                  id
                  time
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attestations");
        }

        const data = await response.json();
        setAttestations(data.data.attestations);
      } catch (error) {
        console.error("Error fetching attestations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttestations();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      ) : (
        <>
          <Title>Recent validations</Title>

          <AttestationList>
            {attestations.map(attestation => {
              const decodedData = parseDecodedData(attestation.decodedDataJson);
              return (
                <AttestationItem key={attestation.id}>
                  <StatementText>{decodedData.requestedTextToVerify}</StatementText>
                  <ValidityText>
                    Validity: <span className="font-bold capitalize">{decodedData.validity}</span>
                  </ValidityText>
                  <CritiqueText>{decodedData.critique}</CritiqueText>
                  <TimeText>Attested on: {new Date(parseInt(attestation.time) * 1000).toLocaleString()}</TimeText>
                  <AttestationCard
                    pkg={{
                      signer: attestation.attester,
                      sig: { uid: attestation.id },
                    }}
                  />
                </AttestationItem>
              );
            })}
          </AttestationList>
        </>
      )}
    </>
  );
}
