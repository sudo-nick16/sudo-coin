import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://root:shorty1@localhost:27017/sudocoin";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "yafwjumtaymftasrtaruyw43pq34fasrtf";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "arst8u4myqmf89astaasrtys";
export const ORIGIN = process.env.ORIGIN?.split(",") || ["http://localhost:5173", "localhost:5173",];
