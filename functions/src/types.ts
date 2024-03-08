import { Log } from "viem";

export interface Context {}

export interface Attribute {
  trait_type: string;
  value: string;
}

type ActionEventLog<EventName extends "Minted" | "Burned"> = Log<
  bigint,
  number,
  false,
  {
    readonly name: EventName;
    readonly type: "event";
    readonly inputs: readonly [
      {
        readonly type: "uint256";
        readonly name: "tokenId";
      }
    ];
  },
  undefined,
  [
    {
      readonly name: EventName;
      readonly type: "event";
      readonly inputs: readonly [
        {
          readonly type: "uint256";
          readonly name: "tokenId";
        }
      ];
    }
  ],
  EventName
>;
export type MintEventLog = ActionEventLog<"Minted">;
export type BurnEventLog = ActionEventLog<"Burned">;
