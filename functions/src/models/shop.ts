import * as mongoose from "mongoose";
import { PayoutInterface } from "@/backend/models/payout";
import { SaleInterface } from "@/backend/models/sale";
import { Country } from "@/backend/config";

export interface ShopInterface extends mongoose.Document {
  /* Core user information */
  _id: string;
  name: string;
  email: string;
  country: Country;
  address: string;
  shopify_vendor_id: string;
  /* Sales related information */
  credit: number;
  comission_percentage: number;
  invoice_address: string;
  /* Required information for payout */
  invoice_account_holder: string;
  invoice_account_number: string;
  invoice_account_swift: string;
  /* Mongoose virtual fields */
  payout_id_list: string[];
  invoice_id_list: string[];
  sale_id_list: string[];
  payouts?: PayoutInterface[];
  sales?: SaleInterface[];
}

const ShopSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    email: String,
    country: {
      type: String,
      enum: Object.keys(Country),
      default: Country.GLOBAL,
    },
    address: { type: String, default: '' },
    shopify_vendor_id: String,
    credit: { type: Number, default: 0 },
    comission_percentage: { type: Number, default: 0 },
    invoice_address: { type: String, default: '' },
    invoice_account_holder: { type: String, default: '' },
    invoice_account_number: { type: String, default: '' },
    invoice_account_swift: { type: String, default: '' },
    payout_id_list: { type: [String], default: [] },
    sale_id_list: { type: [String], default: [] }
  },
  {
    timestamps: { createdAt: `created_at`, updatedAt: `updated_at` },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ShopSchema.virtual(`payouts`, {
  ref: `Payout`,
  localField: `payout_id_list`,
  foreignField: `_id`,
});

ShopSchema.virtual(`sales`, {
  ref: `Sale`,
  localField: `sale_id_list`,
  foreignField: `_id`,
});

export const ShopModel: mongoose.Model<ShopInterface> =
  mongoose.models.Shop || mongoose.model<ShopInterface>(`Shop`, ShopSchema);
