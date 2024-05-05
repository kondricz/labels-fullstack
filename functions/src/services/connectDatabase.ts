import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const connectDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    console.log(`DATABASE CONNECTION ACTIVE ✅`);
    return;
  }
  try {
    // Use new db connection
    if (process.env.MONGO_URL) {
      console.log(`INITIALIZING DATABASE CONNECTION`);
      mongoose.set(`strictQuery`, false);
      await mongoose.connect(process.env.MONGO_URL);
    }
    return;
  } catch (err) {
    console.log(err);
    console.log(`DATABASE COULD NOT BE CONNECTED 🛑`);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
