import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ORIGIN, PORT } from "./constants";
import { getScrapedCoinInfo } from "./scraper";

var client: { [key: string]: Response } = {}

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: ORIGIN,
    credentials: true,
  }));

  app.get("/price-alert/:user_id/:coinId/:low/:high", (req: Request, res: Response) => {
    const userId = req.params.user_id;
    const coinId = req.params.coinId;
    const low = req.params.low;
    const high = req.params.high;

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
      low: Number(low),
      high: Number(high),
      coinId,
    });

    req.on('close', () => {
      console.log(`Connection closed`);
    });
  })

  app.listen(3002, () => {
    console.log("running on port:", PORT);
  })
}

export const subscribeToPriceAlert = async ({ userId, low, high, coinId }: { userId: string, low: number, high: number, coinId: string }) => {
  const res = client[userId];
  const coin = await getScrapedCoinInfo(coinId);
  res.write(`data: ${JSON.stringify({ low, high, coin })}\n\n`);
  setTimeout(() => {
    subscribeToPriceAlert({ userId, low, high, coinId });
  }, 30 * 1000);
}

main();
