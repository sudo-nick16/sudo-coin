import express from "express";
import mongoose from "mongoose";
import { MONGO_URI, ORIGIN, PORT } from "./constants";
import cookieParser from "cookie-parser";
import mountRoutes from "./mount-routes";
import cors from "cors";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  console.log("ORIGIN:", ORIGIN);
  app.use(cors({
    origin: ORIGIN,
    credentials: true,
  }));

  try {
    await mongoose.connect(MONGO_URI, {
      authSource: "admin",
    });
  } catch (e) {
    console.log("error connecting to mongo:", e.message);
  }

  mountRoutes(app);

  app.listen(PORT, () => {
    console.log("running on port:", PORT);
  })
}

main();
