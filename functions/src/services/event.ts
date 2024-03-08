import type { BurnEventLog, MintEventLog } from "../types";
import {
  burnEvent,
  decodeActionEventLog,
  getEventLogs,
  getTransaction,
  mintEvent,
} from "../utils/blockchain";
import { publicClient } from "../utils/client";
import { eventCollection } from "../utils/db";
import { EventSchema, zodParse } from "../utils/schema";
import { burnNFTData, saveNFTData } from "./nft";

export const handlePebbleNFTEvent = async () => {
  const blockNumber = await publicClient.getBlockNumber();

  const fromBlock = await getLastProcessedBlockNumber(blockNumber);
  const toBlock = blockNumber;

  const mintedTokenIds = await handleMintEvent(fromBlock, toBlock);
  const burnedTokenIds = await handleBurnEvent(fromBlock, toBlock);
  await saveLastProcessedBlockNumber(toBlock.toString());

  return { mintedTokenIds, burnedTokenIds };
};

const handleMintEvent = async (fromBlock: bigint, toBlock: bigint) => {
  const eventLogs = await getEventLogs(mintEvent, fromBlock, toBlock);
  const tokenIds = eventLogs.map((log) =>
    decodeActionEventLog(log as MintEventLog)
  );
  return saveNFTData(tokenIds);
};

const handleBurnEvent = async (fromBlock: bigint, toBlock: bigint) => {
  const eventLogs = await getEventLogs(burnEvent, fromBlock, toBlock);
  const promises = eventLogs.map(async (log) => {
    const tokenId = decodeActionEventLog(log as BurnEventLog);
    const transaction = await getTransaction(log.transactionHash);
    return {
      tokenId,
      address: transaction.from.toLowerCase(),
    };
  });
  const burnedTokenData = await Promise.all(promises);
  return burnNFTData(burnedTokenData);
};

const saveLastProcessedBlockNumber = async (blockNumber: string) => {
  const eventRef = eventCollection.doc("nft");
  eventRef.set({ lastProcessedBlockNumber: blockNumber }, { merge: true });
};

const getLastProcessedBlockNumber = async (blockNumber: bigint) => {
  const eventRef = eventCollection.doc("nft");
  const doc = await eventRef.get();
  if (doc.exists) {
    const data = zodParse(doc.data(), EventSchema);
    return BigInt(data.lastProcessedBlockNumber);
  }
  return blockNumber - 100n; // default 100 block behind
};
