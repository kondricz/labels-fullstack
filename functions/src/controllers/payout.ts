import dayjs from "dayjs";
import { NextApiRequest } from "next";
import { connectDatabase } from "@/backend/services/connectDatabase";
import { authenticateShop } from "@/backend/services/authenticateShop";
import { PayoutModel } from "@/backend/models/payout";
import { ShopModel } from "@/backend/models/shop";
import { NextResponse } from "next/server";

export const payoutGetPayouts = async (req: NextApiRequest) => {
  try {
    await connectDatabase();
    const shop = await authenticateShop(req);

    if (!shop) {
      return NextResponse.json({ message: "SHOP NOT FOUND" }, { status: 404 });
    }

    const payoutQuery = {
      shop_id: shop._id,
    };

    const payouts = await PayoutModel.find(payoutQuery).lean();
    return NextResponse.json({ shop, payouts }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "GENERAL ERROR" }, { status: 500 });
  }
};

/**
 * * Request Body:
 *   - `amount` (`number`): Amount of the payout.
 *   - `user_comment` (`string`): User comment for the payout.
 */
export const payoutCreatePayout = async (req: NextApiRequest) => {
  try {
    await connectDatabase();
    const shop = await authenticateShop(req);

    if (!shop) {
      return NextResponse.json({ message: "SHOP NOT FOUND" }, { status: 404 });
    }

    if (!req.body.amount || req.body.amount > shop.credit) {
      return NextResponse.json({ message: "INVALID AMOUNT" }, { status: 422 });
    }
    await PayoutModel.create({
      date: dayjs().format(),
      amount: req.body.amount,
      user_comment: req.body.user_comment,
      shop_id: shop._id,
    });
    await ShopModel.findByIdAndUpdate(shop._id, {
      $inc: { credit: req.body.amount * -1 },
    });
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "GENERAL ERROR" }, { status: 500 });
  }
};

/**
 * * Query Parameters (used only for the patch method)
 *   - `payout_id` (`string`): Payout ID first anchor of authentication
 *   - `payout_token` (`string`): Payout token second anchor of authentication
 *   - `action` (`"COMPLETED"|"REJECTED"`): The ID of the product involved in the transaction.
 */
export const payoutUpdatePayout = async (req: NextApiRequest) => {
  try {
    await connectDatabase();
    const payoutQuery = {
      _id: req.body.payout_id,
      payout_token: req.body.payout_token,
    };

    const payout = await PayoutModel.findOneAndUpdate(
      payoutQuery,
      {
        status: req.body.action,
      },
      { new: true }
    );

    if (req.body.action === "REJECTED" && payout) {
      await ShopModel.findByIdAndUpdate(payout.shop_id, {
        $inc: { credit: payout.amount },
      });
    }

    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "GENERAL ERROR" }, { status: 500 });
  }
};
