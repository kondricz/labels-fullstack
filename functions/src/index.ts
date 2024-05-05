import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import {
  payoutCreatePayout,
  payoutGetPayouts,
  payoutUpdatePayout,
} from "./controllers/payout";
import { authenticateShop } from "./services/authenticateShop";
import { connectDatabase } from "./services/connectDatabase";
import { shopGetShop, shopUpdateShop } from "./controllers/shop";
import { verifyShopifyWebhook } from "./services/verifyShopifyWebhook";
import { syncShopSale } from "./controllers/sync";

/* /api/shop */
export const shop = onRequest(async (request, response) => {
  await connectDatabase(response);
  const shop = await authenticateShop(request);

  if (!shop) {
    response.status(404).send({ message: "SHOP NOT FOUND" });
  }

  switch (request.method) {
    case "GET":
      return shopGetShop(request, response, shop!);
    case "PATCH":
      return shopUpdateShop(request, response, shop!);
    default:
      response.status(422).send({ message: "METHOD NOT AUTHORIZED" });
  }
});

/* /api/payout */
export const payout = onRequest(async (request, response) => {
  await connectDatabase(response);
  const shop = await authenticateShop(request);

  if (!shop && request.method !== "PATCH") {
    response.status(404).send({ message: "SHOP NOT FOUND" });
  }

  switch (request.method) {
    case "GET":
      return payoutGetPayouts(request, response, shop!);
    case "POST":
      return payoutCreatePayout(request, response, shop!);
    case "PATCH":
      return payoutUpdatePayout(request, response);
    default:
      response.status(422).send({ message: "METHOD NOT AUTHORIZED" });
  }
});

/* /api/sync */
export const sync = onRequest(async (request, response) => {
  const isRequestValid = await verifyShopifyWebhook(request);

  if (!isRequestValid){
    logger.info("INVALID WEBHOOK REQUEST")
    response.status(403).send({ message: "UNAUTHORIZED"})
  }
  return syncShopSale(request, response)
});
