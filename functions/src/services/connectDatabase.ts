import mongoose from "mongoose";
import * as logger from "firebase-functions/logger";
import { Response } from "express";

export const connectDatabase = async (response: Response) => {
  if (mongoose.connections[0].readyState) {
    logger.info(`DATABASE CONNECTION ACTIVE ✅`);
    return;
  }
  try {
    // Use new db connection
    if (process.env.MONGO_URL) {
      logger.info(`INITIALIZING DATABASE CONNECTION`);
      mongoose.set(`strictQuery`, false);
      await mongoose.connect(process.env.MONGO_URL);
    }
    return;
  } catch (err) {
    logger.error(err);
    logger.error(`DATABASE COULD NOT BE CONNECTED 🛑`);

    response.status(500).send({ message: "Database could not be connected" });
  }
};
