import parse from "node-html-parser";
import { ScrapedCoin } from "./types";

export const getScrapedTrendingCoins = async (): Promise<unknown[]> => {
  try {
    const res = await fetch("https://www.coingecko.com", {
      headers: {
        'Content-Type': "text/html",
      }
    })
    const data = await res.text();
    const root = parse(data);
    const coins = root.querySelectorAll(`table > tbody > tr`).map(root => {
      const image = root.querySelector(`.coin-name img`)?.getAttribute('src');
      const id = root.querySelector(`.coin-name a`)?.getAttribute('href')?.split('/').pop();
      const name = root.querySelector(`.coin-name a span:first-child`)?.structuredText;
      const symbol = root.querySelector(`.coin-name a span:last-child`)?.structuredText;
      const price = root.querySelector(`.td-price`)?.structuredText;
      const change1h = root.querySelector(`.td-change1h`)?.structuredText;
      const change24h = root.querySelector(`.td-change24h`)?.structuredText;
      const change7d = root.querySelector(`.td-change7d`)?.structuredText;
      const volume24h = root.querySelector(`.td-liquidity_score`)?.structuredText;
      const marketCap = root.querySelector(`.td-market_cap`)?.structuredText;
      const sparkLine = root.querySelector(`td:last-child img`)?.getAttribute('src');
      return {
        id,
        image,
        name,
        symbol,
        price,
        change1h,
        change24h,
        change7d,
        marketCap,
        sparkLine,
        volume24h
      }
    });
    return coins;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}

export const getScrapedCoinInfo = async (coinId: string): Promise<ScrapedCoin | undefined> => {
  try {
    const res = await fetch(`https://www.coingecko.com/en/coins/${coinId}`, {
      headers: {
        'Content-Type': "text/html",
      }
    })
    const data = await res.text();
    const root = parse(data);
    const image = root.querySelector(`.tw-flex img.tw-rounded-full`)?.getAttribute('src')!;
    const name = root.querySelector(`h1.tw-m-0.tw-text-base.tw-break-all > span:first-child`)?.structuredText!;
    const symbol = root.querySelector(`h1.tw-m-0.tw-text-base.tw-break-all > span:last-child`)?.structuredText!;
    const price = root.querySelector(`span.tw-text-gray-900.tw-text-3xl > span`)?.structuredText!;
    const priceChange = root.querySelector(`#general-tab-content > div.tw-flex.tw-flex-col.tw-grid-cols-12.tw-mb-8 > div.tw-col-span-8 > div.my-4 > div:nth-child(2)`);
    const change1h = priceChange?.querySelector(`div:nth-child(1) > span`)?.structuredText!;
    const change24h = priceChange?.querySelector(`div:nth-child(2) > span`)?.structuredText!;
    const change7d = priceChange?.querySelector(`div:nth-child(3) > span`)?.structuredText!;
    const volume24h = root.querySelector(``)?.structuredText!;
    const marketCap = root.querySelector(`#general-tab-content > div.tw-flex.tw-flex-col.tw-grid-cols-12.tw-mb-8 > div.tw-col-span-4.tw-row-span-3.tw-col-end-13.tw-order-2 > div.tw-bg-gray-100.tw-rounded-xl.tw-py-4.tw-mb-3.tw-flex.flex-column.flex-sm-column.order-3.order-sm-3.order-md-3.order-lg-2 > div.px-3 > table > tbody > tr:nth-child(6) > td > span > span`)?.structuredText!;
    const marketRank = root.querySelector(`#general-tab-content > div.tw-flex.tw-flex-col.tw-grid-cols-12.tw-mb-8 > div.tw-col-span-4.tw-row-span-3.tw-col-end-13.tw-order-2 > div.tw-bg-gray-100.tw-rounded-xl.tw-py-4.tw-mb-3.tw-flex.flex-column.flex-sm-column.order-3.order-sm-3.order-md-3.order-lg-2 > div.px-3 > table > tbody > tr:nth-child(5) > td > span`)?.structuredText!;
    return {
      id: coinId,
      image,
      name,
      symbol,
      price,
      change1h,
      change24h,
      change7d,
      marketCap,
      volume24h,
      marketRank
    }
  } catch (error) {
    console.log(error.message);
    return undefined;
  }
}
