import admin from "firebase-admin";
import { NextApiRequest } from "next";
import { ShopModel } from "../models/shop";

admin.initializeApp({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  credential: admin.credential.cert(require("../../.env.service-account.json")),
});

export const authenticateShop = async ({
  headers,
}: NextApiRequest) => {
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
    console.log("AUTH ERROR:", e);
    return null;
  }
};
