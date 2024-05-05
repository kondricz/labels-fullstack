import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export enum PayoutStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export interface PayoutInterface extends mongoose.Document {
  _id: string;
  date: string;
  amount: number;
  user_comment: string;
  payout_token: string;
  shop_id: string;
  status: PayoutStatus;
}

const PayoutSchema = new mongoose.Schema(
  {
    _id: String,
    date: String,
    amount: Number,
    user_comment: { type: String, default: '' },
    payout_token: { type: String, default: uuidv4() },
    shop_id: String,
    status: {
      type: String,
      enum: Object.keys(PayoutStatus),
      default: PayoutStatus.PENDING,
    },
  },
  {
    timestamps: { createdAt: `created_at`, updatedAt: `updated_at` },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

export const PayoutModel: mongoose.Model<PayoutInterface> =
  mongoose.models.Payout ||
  mongoose.model<PayoutInterface>(`Payout`, PayoutSchema);
