import { Response } from "express";
import { Request } from "firebase-functions/v2/https";
import { getNFTData } from "../services/nft";
import { apiErrorHandler, validateRequestMethod } from "../utils/error";
import { tokenMetadataParams, zodParse } from "../utils/schema";

export const getTokenMetadata = async (req: Request, res: Response) => {
  validateRequestMethod(req, res, ["GET"]);
  try {
    const params = req.params;
    const { "0": tokenId } = zodParse(params, tokenMetadataParams);
    const nft = await getNFTData(tokenId);
    res.status(200).json(nft?.toJSON());
  } catch (error) {
    apiErrorHandler(error as Error, res);
  }
};
