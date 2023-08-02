import { Request, Response } from "express";
import axios from "axios";
import { getScrapedCoinInfo, getScrapedTrendingCoins } from "../scraper";

export const getTrendingCoins = async (_: Request, res: Response) => {
  try {
    // const resp = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&sparkline=false&price_change_percentage=24h");
    // const coins = resp.data;
    return res.status(200).json({
      coins: await getScrapedTrendingCoins(),
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

export const getCoinInfo = async (req: Request, res: Response) => {
  const coinId = req.params.coinId;
  if (!coinId) {
    return res.status(400).json({ error: "coingechoId missing" });
  }
  try {
    // const resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    // const coin = resp.data;
    // console.log(resp.data)
    // return res.status(200).json({
    //   coin: {
    //     id: coin.id,
    //     symbol: coin.symbol,
    //     name: coin.name,
    //     image: coin.image.large,
    //     price_change_percentage_24h_in_currency: coin.market_data.price_change_percentage_24h_in_currency.usd,
    //     current_price: coin.market_data.current_price.usd,
    //     market_cap: coin.market_data.market_cap.usd,
    //     low_24h: coin.market_data.low_24h.usd,
    //     high_24h: coin.market_data.high_24h.usd,
    //   }
    // })

    const coin = await getScrapedCoinInfo(coinId);
    if (!coin) {
      return res.status(404).json({ error: "coin not found" });
    };
    return res.status(200).json({
      coin,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

export const getCoinPriceHistory = async (req: Request, res: Response) => {
  const coinId = req.params.coinId;
  const days = req.params.days;
  if (!coinId || !days) {
    return res.status(400).json({ error: "coinId or days missing" });
  }
  try {
    const resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const prices = resp.data;
    return res.status(200).json({
      prices,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
