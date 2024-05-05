import { ShopInterface } from "../models/shop";

/** EXAMPLE:
 * 
 * grossAmount: 1000 EUR
 * shop tax: 23%
 * shop comission: 20%
 * 
 * 
 * taxRate = 1000 * 0.23
 * comissionAmount = (1000 - 230) * 0.2
 * 
 * gross_amount: 1000 EUR
 * tax_rate: 230 EUR
 * comission_amount: 154 EUR
 * net_amount: 616 EUR
 */

export const calculateSale = (grossAmount: number, shop: ShopInterface) => {
  const taxRate = grossAmount * shop.tax_rate;
  const comissionAmount = (grossAmount - taxRate) * shop.comission_percentage;
  return {
    gross_amount: grossAmount,
    tax_rate: taxRate,
    comission_amount: comissionAmount,
    net_amount: grossAmount - taxRate - comissionAmount,
  };
};
