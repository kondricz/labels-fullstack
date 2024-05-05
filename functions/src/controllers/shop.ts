import * as logger from "firebase-functions/logger";
import { Request, Response } from "express";
import { ShopInterface, ShopModel } from "../models/shop";
import { SaleModel } from "../models/sale";

/**
 * * Query Parameters:
 *   - `from` (`string`): The starting point of the transaction.
 *   - `to` (`string`): The destination point of the transaction.
 *   - `product_id` (`string`): The ID of the product involved in the transaction.
 *   - `amount_from` (`number`): The minimum amount involved in the transaction.
 *   - `amount_to` (`number`): The maximum amount involved in the transaction.
 *
 * */
export const shopGetShop = async (
  req: Request,
  res: Response,
  shop: ShopInterface
) => {
  try {
    const saleQuery = {
      shop_id: shop._id,
      ...(req.query.from && { $gte: { sale_date: req.query.from } }),
      ...(req.query.to && { $lte: { sale_date: req.query.to } }),
      ...(req.query.product_id && { product_id: req.query.product_id }),
      ...(req.query.amount_from && { $gte: { amount: req.query.amount_from } }),
      ...(req.query.amount_to && { $lte: { amount: req.query.amount_to } }),
    };

    const sales = await SaleModel.find(saleQuery).lean();
    res.status(200).send({ shop, sales });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "GENERAL ERROR" });
  }
};

/**
 * * Request Body:
 *   - `name` (`string`): The name of the customer.
 *   - `address` (`string`): The address of the customer.
 *   - `invoice_address` (`string`, optional): The invoice address of the customer.
 *   - `invoice_account_holder` (`string`, optional): The name of the account holder for invoicing.
 *   - `invoice_account_number` (`string`, optional): The account number for invoicing.
 *   - `invoice_account_swift` (`string`, optional): The SWIFT code for the invoicing account.
 */
export const shopUpdateShop = async (
  req: Request,
  res: Response,
  shop: ShopInterface
) => {
  try {
    const whiteListedKeys = [
      "name",
      "address",
      "invoice_address",
      "invoice_account_holder",
      "invoice_account_number",
      "invoice_account_swift",
    ];

    const payload = Object.keys(req.body);

    if (!payload.every((key) => whiteListedKeys.includes(key))) {
      res.status(422).send({ message: "UNAUTHORIZED UPDATE" });
    }
    await ShopModel.findByIdAndUpdate(shop._id, req.body);
    res.status(201).send({});
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "GENERAL ERROR" });
  }
};
