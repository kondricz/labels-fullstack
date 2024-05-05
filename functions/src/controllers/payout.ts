import * as dayjs from "dayjs";
import * as logger from "firebase-functions/logger";
import { Request, Response } from "express";
import { ShopInterface, ShopModel } from "../models/shop";
import { PayoutModel } from "../models/payout";

export const payoutGetPayouts = async (
  _req: Request,
  res: Response,
  shop: ShopInterface
) => {
  try {
    const payoutQuery = {
      shop_id: shop._id,
    };

    const payouts = await PayoutModel.find(payoutQuery).lean();
    res.status(200).send({ shop, payouts });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "GENERAL ERROR" });
  }
};

/**
 * * Request Body:
 *   - `amount` (`number`): Amount of the payout.
 *   - `user_comment` (`string`): User comment for the payout.
 */
export const payoutCreatePayout = async (
  req: Request,
  res: Response,
  shop: ShopInterface
) => {
  try {
    if (!req.body.amount || req.body.amount > shop.credit) {
      res.status(422).send({ message: "INVALID AMOUNT " });
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
    res.status(201).send({});
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "GENERAL ERROR" });
  }
};

/**
 * * Query Parameters (used only for the patch method)
 *   - `payout_id` (`string`): Payout ID first anchor of authentication
 *   - `payout_token` (`string`): Payout token second anchor of authentication
 *   - `action` (`"COMPLETED"|"REJECTED"`): The ID of the product involved in the transaction.
 */
export const payoutUpdatePayout = async (req: Request, res: Response) => {
  try {
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

    res.status(201).send({});
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "GENERAL ERROR" });
  }
};
