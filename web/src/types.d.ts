export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price_change_percentage_24h_in_currency: number;
  current_price: number;
  market_cap: number;
  low_24h: number;
  high_24h: number;
}

export type ScrapedCoin = {
  id: string;
  image: string;
  marketCap: string;
  name: string;
  price: string;
  symbol: string;
  change1h: string;
  change7d: string;
  change24h: string;
  volume24h: string;
  sparkLine?: string;
  marketRank?: string;
}

export type Tracker = {
  coingeckoId: string;
  user_id: string;
  id: string;
  coin: ScrapedCoin;
}

export type User = {
  id: string;
  name: string;
  email: string;
}
