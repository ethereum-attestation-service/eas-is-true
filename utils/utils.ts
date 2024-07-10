import { AttestationShareablePackageObject } from "@ethereum-attestation-service/eas-sdk";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const baseURL = "https://sepolia.easscan.org";

export async function submitSignedAttestation(pkg: AttestationShareablePackageObject): Promise<StoreIPFSActionReturn> {
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg),
  };

  const response = await fetch(`${baseURL}/offchain/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export type StoreAttestationRequest = { filename: string; textJson: string };

export type StoreIPFSActionReturn = {
  error: null | string;
  ipfsHash: string | null;
  offchainAttestationId: string | null;
};
