import { Request, Response } from "express";
import { shopify } from "../services/connectShopify";
import { calculateSale } from "../helpers/calculateSale";
import { ShopModel } from "../models/shop";
import { sendProductRefundNotification } from "../services/sendDiscordNotification";

interface ShopRefundRequest {
  refund_line_items: {
    id: number;
    quantity: number;
    subtotal: number;
    line_item_id: number;
    location_id: number;
    restock_type: string;
    total_tax: number;
  }[];
}

export const refundShopSale = async (req: Request, res: Response) => {
  const payload: ShopRefundRequest = req.body;
  const shops = await ShopModel.find();

  const lineItemList = await Promise.all(
    payload.refund_line_items.map(async (item) => {
      const product = await shopify.product.get(item.id);
      const shop = shops.find((shop) => shop._id === product.vendor);

      if (!product || !shop) {
        return;
      }

      return { ...item, product, shop };
    })
  );

  for (const lineItem of lineItemList) {
    if (!lineItem) {
      continue;
    }
    const prices = calculateSale(
      lineItem.quantity * lineItem.subtotal,
      lineItem.shop
    );
    await new Promise((resolve) => setTimeout(resolve, 250));
    await ShopModel.findByIdAndUpdate(lineItem.shop._id, {
      $inc: { credit: prices.comission_amount * -1 },
    });

    await sendProductRefundNotification(
      lineItem.quantity,
      lineItem.product.title,
      lineItem.shop
    );
  }

  res.status(201).send({});
};
