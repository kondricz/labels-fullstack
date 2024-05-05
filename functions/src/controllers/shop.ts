import { NextApiRequest } from "next";
import { connectDatabase } from "@/backend/services/connectDatabase";
import { authenticateShop } from "@/backend/services/authenticateShop";
import { SaleModel } from "@/backend/models/sale";
import { ShopModel } from "@/backend/models/shop";
import { NextResponse } from "next/server";

/**
 * * Query Parameters:
 *   - `from` (`string`): The starting point of the transaction.
 *   - `to` (`string`): The destination point of the transaction.
 *   - `product_id` (`string`): The ID of the product involved in the transaction.
 *   - `amount_from` (`number`): The minimum amount involved in the transaction.
 *   - `amount_to` (`number`): The maximum amount involved in the transaction.
 *
 * */
export const shopGetShop = async (req: NextApiRequest) => {
  try {
    await connectDatabase();
    const shop = await authenticateShop(req);

    if (!shop) {
      return NextResponse.json({ message: "SHOP NOT FOUND" }, { status: 404 });
    }

    const saleQuery = {
      shop_id: shop._id,
      ...(req.query.from && { $gte: { sale_date: req.query.from } }),
      ...(req.query.to && { $lte: { sale_date: req.query.to } }),
      ...(req.query.product_id && { product_id: req.query.product_id }),
      ...(req.query.amount_from && { $gte: { amount: req.query.amount_from } }),
      ...(req.query.amount_to && { $lte: { amount: req.query.amount_to } }),
    };

    const sales = await SaleModel.find(saleQuery).lean();
    return NextResponse.json({ shop, sales }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "GENERAL ERROR" }, { status: 500 });
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
export const shopUpdateShop = async (req: NextApiRequest) => {
  try {
    await connectDatabase();
    const shop = await authenticateShop(req);

    if (!shop) {
      return NextResponse.json({ message: "SHOP NOT FOUND" }, { status: 404 });
    }

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
      return NextResponse.json(
        { message: "UNAUTHORIZED UPDATE" },
        { status: 422 }
      );
    }
    await ShopModel.findByIdAndUpdate(shop._id, req.body);
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "GENERAL ERROR" }, { status: 500 });
  }
};
