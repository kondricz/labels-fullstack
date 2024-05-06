import { Request, Response } from "express";
import { shopify } from "../services/connectShopify";
import { Currency } from "../config/config";
import { SaleModel } from "../models/sale";
import { ShopInterface, ShopModel } from "../models/shop";
import { calculateSale } from "../helpers/calculateSale";
import { sendProductBoughtNotification } from "../services/sendDiscordNotification";

import dayjs = require("dayjs");

interface ShopSaleLineItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  vendor: string;
}

interface ShopSaleRequest {
  total_line_items_price: string;
  total_line_items_price_set: {
    shop_money: {
      amount: string;
      currency_code: Currency;
    };
  };
  line_items: ShopSaleLineItem[];
}

export const syncShopSale = async (req: Request, res: Response) => {
  const payload: ShopSaleRequest = req.body;
  const shops = await ShopModel.find();

  const lineItemList = await Promise.all(
    payload.line_items.map(async (item: ShopSaleLineItem) => {
      let shop: ShopInterface | undefined;

      if (!item.vendor) {
        const product = await shopify.product.get(item.id);
        shop = shops.find((shop) => shop._id === product.vendor);
      } else {
        shop = shops.find((shop) => shop._id === item.vendor);
      }

      if (!shop) {
        return;
      }
      const prices = calculateSale(parseInt(item.price) * item.quantity, shop);

      return {
        ...item,
        ...prices,
        shop,
      };
    })
  );

  for (const lineItem of lineItemList) {
    if (!lineItem) {
      continue;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
    await ShopModel.findByIdAndUpdate(lineItem.shop._id, {
      $inc: { credit: lineItem.comission_amount },
    });
    await SaleModel.create({
      product_id: lineItem.id,
      shop_id: lineItem.shop._id,
      amount: lineItem.gross_amount,
      shop_comission: lineItem.comission_amount,
      profit: lineItem.net_amount,
      sale_date: dayjs().format(),
    });
    await sendProductBoughtNotification(lineItem.gross_amount, lineItem.shop);
  }

  res.status(201).send({});
};
