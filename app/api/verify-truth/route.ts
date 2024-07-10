import { NextRequest, NextResponse } from "next/server";
import { AttestationShareablePackageObject, EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { getResponseFromLLM } from "~~/services/llm";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const verifySchemaUid = "0x40e5abe23a3378a9a43b7e874c5cb8dfd4d6b0823501d317acee41e08d3af4dd";
const provider = new ethers.AlchemyProvider("sepolia", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
const account = new ethers.Wallet(process.env.ETH_KEY as string, provider);
const eas = new EAS(EASContractAddress, { signer: account });

export async function POST(request: NextRequest) {
  try {
    const { statement } = await request.json();

    const { model, modelResponseObject } = await getResponseFromLLM(statement);

    const schemaEncoder = new SchemaEncoder(
      "string requestedTextToVerify,string model,string validity,string critique",
    );

    const data = schemaEncoder.encodeData([
      {
        type: "string",
        value: statement,
        name: "requestedTextToVerify",
      },
      {
        type: "string",
        value: model,
        name: "model",
      },
      {
        type: "string",
        value: modelResponseObject.validity,
        name: "validity",
      },
      {
        type: "string",
        value: modelResponseObject.critique,
        name: "critique",
      },
    ]);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        data,
        schema: verifySchemaUid,
        recipient: ethers.ZeroAddress,
        time: BigInt(Math.floor(Date.now() / 1000)),
        expirationTime: 0n,
        refUID: ethers.ZeroHash,
        revocable: true,
      },
      account,
    );

    const pkg: AttestationShareablePackageObject = {
      signer: account.address,
      sig: offchainAttestation,
    };

    return NextResponse.json({ result: pkg });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error verifying statement" }, { status: 500 });
  }
}

// Handles cors preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
