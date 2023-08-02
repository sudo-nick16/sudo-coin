import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { MONGO_URI, SMTP_PASS, SMTP_USER } from "./constants";
import userModel from "./models/user";
import trackerModel from "./models/tracker";
import { ScrapedCoin, Tracker } from "./types";
import { getScrapedCoinInfo } from "./scraper";
import cron from "node-cron";

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

const getCoinHtml = (coin: ScrapedCoin) => {
  return `
  <div style='display: flex;'>
    <div style='display: flex; flex-direction: column;'>
      <img src=${coin.image} /> 
      <h2>${coin.name}</h2>
    </div>
    <div style='display: flex; flex-direction: column;'>
      <span>Price: ${coin.price}</span>
      <span>Change 24h: ${coin.change24h}</span>
    </div> 
  <div>
  `
}

async function daily_update() {
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
      const coin = await getScrapedCoinInfo(trackers[j].coingeckoId);
      if (!coin) {
        continue;
      }
      body += getCoinHtml(coin);
    }
    sendMail(users[i].email, body);
  }
}

const task = cron.schedule('0 1 * * *', () => {
  daily_update();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

task.start();
