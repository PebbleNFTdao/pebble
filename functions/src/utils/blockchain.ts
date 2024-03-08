import { AbiEvent } from "abitype";
import {
  decodeEventLog,
  encodePacked,
  keccak256,
  parseAbiItem,
  toBytes,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readContract } from "viem/actions";
import * as PebbleNFT from "../abi/PebbleNFT.json";
import { IS_DEV, OWNER_LOCAL_PRIVATE_KEY, PEBBLE_NFT_ADDRESS } from "../config";
import type { BurnEventLog, MintEventLog } from "../types";
import { publicClient } from "./client";

export const getOwnedTokenIds = async (address: string) => {
  const tokenIds = await readContract(publicClient, {
    address: PEBBLE_NFT_ADDRESS.value() as `0x${string}`,
    abi: PebbleNFT.abi,
    functionName: "getOwnedTokens",
    args: [address],
  });
  return tokenIds as bigint[];
};

export const mintEvent = parseAbiItem("event Minted(uint256 tokenId)");
export const burnEvent = parseAbiItem("event Burned(uint256 tokenId)");

export const getEventLogs = async (
  event: AbiEvent,
  fromBlock: bigint,
  toBlock: bigint
) => {
  const logs = await publicClient.getLogs({
    address: PEBBLE_NFT_ADDRESS.value() as `0x${string}`,
    event,
    fromBlock,
    toBlock,
  });
  return logs;
};

export const decodeActionEventLog = (log: MintEventLog | BurnEventLog) => {
  const topics = decodeEventLog({
    abi: PebbleNFT.abi,
    data: log.data,
    topics: log.topics,
  });
  const tokenId = (topics.args as unknown as { tokenId: bigint }).tokenId;
  return tokenId.toString();
};

const SIGNATURE_EXPIRATION = 60; // 1 minute

export const signMessageByOwner = async (
  address: `0x${string}`,
  tokenIds: string[]
) => {
  const account = privateKeyToAccount(
    IS_DEV
      ? (OWNER_LOCAL_PRIVATE_KEY.value() as `0x${string}`)
      : (process.env.OWNER_SECRET_PRIVATE_KEY as `0x${string}`)
  );
  const tokenIdBigInts = tokenIds.map((id) => BigInt(id));
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + SIGNATURE_EXPIRATION;
  const expirationBigInt = BigInt(expiration);
  const message = keccak256(
    encodePacked(
      ["uint256[]", "address", "uint256"],
      [tokenIdBigInts, address, expirationBigInt]
    )
  );
  const signature = await account.signMessage({
    message: { raw: toBytes(message) },
  });
  return { tokenIds, signature, expiration };
};

export const getTransaction = async (txHash: `0x${string}`) => {
  const transaction = await publicClient.getTransaction({
    hash: txHash,
  });
  return transaction;
};

export const getTotalSupply = async (blockNumber: bigint) => {
  const totalSupply = await readContract(publicClient, {
    address: PEBBLE_NFT_ADDRESS.value() as `0x${string}`,
    abi: PebbleNFT.abi,
    functionName: "totalSupply",
    blockNumber,
  });
  return totalSupply;
};

export const getOwnerOf = async (tokenId: bigint, blockNumber: bigint) => {
  const ownerAddress = await readContract(publicClient, {
    address: PEBBLE_NFT_ADDRESS.value() as `0x${string}`,
    abi: PebbleNFT.abi,
    functionName: "ownerOf",
    args: [tokenId],
    blockNumber,
  });
  return (ownerAddress as string).toLowerCase();
};
