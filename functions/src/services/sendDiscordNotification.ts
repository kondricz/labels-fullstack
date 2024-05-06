import axios from "axios";
import { ShopInterface } from "../models/shop";
import { calculateSale } from "../helpers/calculateSale";
import { Webhooks, countries } from "../config/config";

export const sendProductBoughtNotification = async (
  totalAmount: number,
  shop: ShopInterface
) => {
  const prices = calculateSale(totalAmount, shop);
  const body = {
    content: `:moneybag: An article sold. Lets make some money. ${
      shop.name
    } just sold ${prices.gross_amount} ${countries[shop.country].currency}`,
  };
  try {
    await axios({
      method: "POST",
      url: Webhooks.DISCORD_SALES_NOTIFICATION,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
};

export const sendProductRefundNotification = async (
  quantity: number,
  productName: string,
  shop: ShopInterface
) => {
  const body = {
    content: `:thread: An article refunded. No No No. ${shop.name} has ${quantity} pcs sent back of ${productName}.`,
  };
  try {
    await axios({
      method: "POST",
      url: Webhooks.DISCORD_SALES_NOTIFICATION,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    });
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
};
