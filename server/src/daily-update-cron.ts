import nodemailer from "nodemailer";
import axios from "axios";
import mongoose from "mongoose";
import { MONGO_URI, SMTP_PASS, SMTP_USER } from "./constants";
import userModel from "./models/user";
import trackerModel from "./models/tracker";
import { Coin, Tracker } from "./types";

const transporter = nodemailer.createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

async function sendMail(to: string, body: string) {
  const info = await transporter.sendMail({
    from: 'sudocoin 🪙',
    to: to,
    subject: "daily update 🪙",
    html: body
  });
  console.log("Message sent: %s", info.messageId);
}

const getCoinHtml = (coin: Coin) => {
  return `
  <div style='display: flex;'>
    <div style='display: flex; flex-direction: column;'>
      <img src=${coin.image} /> 
      <h2>${coin.name}</h2>
    </div>
    <div style='display: flex; flex-direction: column;'>
      <span>low: ${coin.low_24h}</span>
      <span>high: ${coin.high_24h}</span>
    </div> 
  <div>
  `
}

async function init() {
  try {
    await mongoose.connect(MONGO_URI, {
      authSource: "admin",
    });
  } catch (e) {
    console.log(e.message);
  }

  const users = await userModel.find();
  if (!users) {
    return;
  }
  for (let i = 0; i < users.length; ++i) {
    const trackers: Tracker[] = await trackerModel.find({ user_id: users[i].id });
    if (!trackers) {
      continue;
    }
    let body = '';
    for (let j = 0; j < trackers.length; ++j) {
      const resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${trackers[i].coingeckoId}`);
      const coin = resp.data;
      const coinData: Coin = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image.large,
        price_change_percentage_24h_in_currency: coin.market_data.price_change_percentage_24h_in_currency.usd,
        current_price: coin.market_data.current_price.usd,
        market_cap: coin.market_data.market_cap.usd,
        low_24h: coin.market_data.low_24h.usd,
        high_24h: coin.market_data.high_24h.usd,
      }
      body += getCoinHtml(coinData);
    }
    sendMail(users[i].email, body);
  }
}

init();
