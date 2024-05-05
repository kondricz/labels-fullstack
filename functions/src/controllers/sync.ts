import { Request, Response } from "express";
import { Currency } from "../config/config";
import { SaleModel } from "../models/sale";
import { ShopModel } from "../models/shop";
import { calculateSale } from "../helpers/calculateSale";
import dayjs = require("dayjs");

interface ShopSaleLineItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  vendor: string;
}

interface EnrichedLineItem extends ShopSaleLineItem {
  vendor: string;
  gross_amount: number;
  tax_rate: number;
  comission_amount: number;
  net_amount: number;
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

  const productList = payload.line_items
    .map((item: ShopSaleLineItem) => {
      const vendor = shops.find((shop) => shop._id === item.vendor);
      if (!vendor) {
        return;
      }
      const prices = calculateSale(parseInt(item.price), vendor);

      return {
        ...item,
        ...prices,
        vendor: vendor._id,
      };
    })
    .filter(Boolean) as EnrichedLineItem[];

  for (const product of productList) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await ShopModel.findByIdAndUpdate(product.vendor, {
      $inc: { credit: product.comission_amount },
    });
    await SaleModel.create({
      product_id: product.id,
      shop_id: product.vendor,
      amount: product.gross_amount,
      shop_comission: product.gross_amount,
      profit: product.net_amount,
      sale_date: dayjs().format(),
    });
  }

  // 1. Create a sale in our sale database
  // 2. Update the credit of the shop
  // 3. Send a discord notification

  res.status(201).send({});
};
