import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { MONGO_URI, SMTP_PASS, SMTP_USER } from "./constants";
import userModel from "./models/user";
import trackerModel from "./models/tracker";
import { ScrapedCoin } from "./types";
import { getScrapedCoinInfo } from "./scraper";
import cron from "node-cron";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
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
  <tr>
    <td>
      <img src=${coin.image} style='height: 30px; width: 30px;' /> 
    </td>
    <td>
      <h2><strong>${coin.name}</strong></h2>
    </td>
  </tr>
  <tr>
    <td>
      <strong>Price:</strong>
    </td> 
    <td>
       ${coin.price}
    </td>
  </tr>
  <tr>
    <td>
      <strong>Change 24h:</strong>
    </td> 
    <td> 
      ${coin.change24h}
    </td>
  </tr>
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
    const trackers = await trackerModel.find({ user_id: users[i].id });
    if (!trackers) {
      continue;
    }
    let body = '';
    for (let j = 0; j < trackers.length; ++j) {
      const coin = await getScrapedCoinInfo(trackers[j].coingecko_id);
      console.log(coin);
      if (!coin) {
        continue;
      }
      body += getCoinHtml(coin);
    }
    body = `
    <table>
      <tr>
        <td>
          <img src="https://i.ibb.co/wghqyKS/dollar.png" style="height: 50px; width: 50px" />
        </td>
        <td>
          <strong>Sudocoin</strong>
        </td>
      </tr>
      ${body}
    </table>
    `
    console.log(body);
    sendMail(users[i].email, body);
  }
}

const task = cron.schedule('0 1 * * *', () => {
  console.log("sending update emails");
  daily_update();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


export const init_cron = () => {
  task.start();
}
