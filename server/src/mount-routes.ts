import { Express } from 'express';
import { login, logout, refreshToken, register } from './handlers/auth-handlers';
import { createCoinTracker, createLimitTracker, getMe, getUserLimitTracker, getUserTrackers } from './handlers/user-handlers';
import { getCoinInfo, getCoinPriceHistory, getTrendingCoins } from './handlers/coin-handlers';
import { authMiddleware } from './middlewares/auth-middleware';

const mountRoutes = (app: Express) => {

  app.get('/', (_, res) => {
    res.send("sudocoin to the moon.");
  });

  // mount auth routes

  app.post('/auth/login', login);
  app.post('/auth/sign-up', register);
  app.post('/auth/logout', logout);
  app.post('/auth/refresh-token', refreshToken);

  // mount user routes

  app.get('/users/me', authMiddleware, getMe);

  // mount tracker routes

  app.get('/trackers', authMiddleware, getUserTrackers);
  app.post('/trackers/:coingeckoId', authMiddleware, createCoinTracker);
  app.post('/limit-trackers/:trackerId', authMiddleware, createLimitTracker);
  app.get('/limit-trackers/:trackerId', authMiddleware, getUserLimitTracker);

  // mount coin routes

  app.get("/coins", getTrendingCoins)
  app.get("/coins/:coinId", getCoinInfo)
  app.get("/coins/:coinId/history/:days", getCoinPriceHistory)
}

export default mountRoutes;
