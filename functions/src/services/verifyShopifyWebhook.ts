import { Request } from "express";
import * as crypto from "crypto";
import * as logger from "firebase-functions/logger";

const SHOPIFY_SECRET =
  "e0a4e7b343e040c06dec9870a7f9a20a0c6a732462d574d1b8ae9c1dfb5bb1fd";

export const verifyShopifyWebhook = async (req: Request) => {
  const hmacHeader = req.headers["x-shopify-hmac-sha256"];
  const digest = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    // @ts-ignore
    .update(req.rawBody)
    .digest("base64");

  logger.info("VERIFY SHOPIFY WEBHOOK")
  logger.info({ digest, hmacHeader });

  return digest === hmacHeader;
  // Compare the result with the header
};
