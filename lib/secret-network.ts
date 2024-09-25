// src/lib/secretNetwork.ts


import { SecretNetworkClient, Wallet } from "secretjs";

let secretjs: SecretNetworkClient;

export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface NotesResponse {
  notes: Note[];
}

export const initializeSecretJS = async () => {
  // This is a placeholder. In a real app, you'd need to implement secure key management
  const wallet = new Wallet("your-mnemonic-here");
  
  secretjs = new SecretNetworkClient({
    url: "https://grpc.pulsar.scrttestnet.com",
    chainId: "pulsar-2",
    wallet: wallet,
    walletAddress: wallet.address,
  });

  return secretjs;
};

export const getSecretJS = () => {
  if (!secretjs) {
    throw new Error("SecretJS not initialized");
  }
  return secretjs;
};

export const addNote = async (title: string, content: string) => {
  const secretjs = getSecretJS();
  const msg = {
    add_note: {
      title: title,
      content: content,
    },
  };

  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contract_address: "your-contract-address",
      code_hash: "your-contract-code-hash", // optional but way faster
      msg: msg,
    },
    {
      gasLimit: 100_000,
    }
  );

  console.log("Transaction hash: ", tx.transactionHash);
  return tx;
};

export const getNotes = async (): Promise<NotesResponse> => {
  const secretjs = getSecretJS();
  const query = {
    get_notes: {},
  };

  const response = await secretjs.query.compute.queryContract({
    contract_address: "your-contract-address",
    code_hash: "your-contract-code-hash", // optional but way faster
    query: query,
  });

  return response as NotesResponse;
};