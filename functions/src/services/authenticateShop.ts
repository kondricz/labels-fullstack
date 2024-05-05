import { Request } from "express";
import * as logger from "firebase-functions/logger";
import * as admin from 'firebase-admin';
import { ShopModel } from "../models/shop";

admin.initializeApp({});

export const authenticateShop = async ({ headers }: Request) => {
  const auth = admin.auth();
  const authToken = headers["x-auth-id"];

  if (!authToken) {
    return null;
  }

  try {
    const { uid } =
      process.env.NO_AUTH == "1"
        ? { uid: authToken }
        : await auth.verifyIdToken(authToken as string);
    const shop = await ShopModel.findById(uid)
      .populate("invoices")
      .populate("payouts")
      .lean();

    if (!shop) {
      return null;
    }

    return shop;
  } catch (e) {
    logger.error("AUTH ERROR:", e);
    return null;
  }
};
