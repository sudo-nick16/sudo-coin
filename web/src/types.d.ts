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

export type Tracker = {
  coingeckoId: string;
  user_id: string;
  id: string;
  coin: Coin;
}

export type User = {
  id: string;
  name: string;
  email: string;
}
