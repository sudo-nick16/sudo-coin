import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { MONGO_URI, ORIGIN, PORT } from "./constants";
import cookieParser from "cookie-parser";
import mountRoutes from "./mount-routes";
import cors from "cors";
import { getScrapedCoinInfo } from "./scraper";
import limitTrackerModel from "./models/limit-tracker";
import { init_cron } from "./daily-update-cron";

var client: { [key: string]: Response } = {}

async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));
  app.use(cookieParser());
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

  app.get("/price-alert/:user_id", (req: Request, res: Response) => {
    const userId = req.params.user_id;

    if (!userId) {
      return res.status(400).json({ error: "user_id missing" });
    }
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers);

    client[userId] = res;

    subscribeToPriceAlert({
      userId,
    });

    return;
  });

  app.listen(PORT, () => {
    console.log("running on port:", PORT);
  })

  init_cron();
}

main();

export const subscribeToPriceAlert = async ({ userId }: { userId: string }) => {
  const res = client[userId];
  const limitTrackers = await limitTrackerModel.find({ user_id: userId }).exec();
  console.log("traxking.....")
  res.write(`data: ${JSON.stringify({ type: "ping" })}\n\n`);
  for (const limitTracker of limitTrackers) {
    const coin = await getScrapedCoinInfo(limitTracker.coingecko_id);
    if (!coin) {
      continue;
    }
    coin.price = coin.price.replace(/[$\,,]/g, "")

    console.log("hello", parseFloat(coin?.price), limitTracker.lower_limit, limitTracker.upper_limit);
    const data = {
      type: "alert",
      low: limitTracker.lower_limit,
      high: limitTracker.upper_limit,
      coin,
      message: "",
    }
    if (Number(coin?.price) < limitTracker.lower_limit) {
      data.message = `Price of ${coin?.name} has fallen below ${limitTracker.lower_limit}`;
      await limitTrackerModel.deleteOne({ _id: limitTracker._id }).exec();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } else if (Number(coin?.price) > limitTracker.upper_limit) {
      data.message = `Price of ${coin?.name} has risen above ${limitTracker.upper_limit}`;
      await limitTrackerModel.deleteOne({ _id: limitTracker._id }).exec();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
  setTimeout(() => {
    subscribeToPriceAlert({ userId });
  }, 10 * 1000);
}
