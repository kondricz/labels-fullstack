import * as mongoose from "mongoose";

export interface SaleInterface extends mongoose.Document {
  _id: string;
  product_id: string;
  shop_id: string;
  amount: number;
  shop_comission: number;
  profit: number;
  sale_date: number;
  is_refunded: boolean;
}

const SaleSchema = new mongoose.Schema(
  {
    _id: String,
    product_id: String,
    shop_id: String,
    amount: Number,
    shop_comission: Number,
    profit: Number,
    sale_date: String,
    is_refunded: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: `created_at`, updatedAt: `updated_at` },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

export const SaleModel: mongoose.Model<SaleInterface> =
  mongoose.models.Sale || mongoose.model<SaleInterface>(`Sale`, SaleSchema);
