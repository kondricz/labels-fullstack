import { Request, Response } from "express";
import { shopify } from "../services/connectShopify";
import { calculateSale } from "../helpers/calculateSale";
import { ShopModel } from "../models/shop";

interface ShopRefundRequest {
  refund_line_items: {
    id: number;
    quantity: number;
    subtotal: number;
    line_item_id: number;
    location_id: number;
    restock_type: string;
    total_tax: number;
    vendor: string;
  }[];
}

export const refundShopSale = async (req: Request, res: Response) => {
  const payload: ShopRefundRequest = req.body;
  const shops = await ShopModel.find();

  const products = await Promise.all(
    payload.refund_line_items.map(async (item) => ({
      ...item,
      product: await shopify.product.get(item.id)
    })
  ));


  for (const product of products) {
    const vendor = shops.find((shop) => shop._id === product.vendor);

    if (!vendor) {
      return;
    }
    
    const prices = calculateSale(product.quantity * product.subtotal, vendor)
    await new Promise((resolve) => setTimeout(resolve, 250));
    await ShopModel.findByIdAndUpdate(vendor._id, {
      $inc: { credit: prices.comission_amount * -1 },
    });
  }

  res.status(201).send({});
};
