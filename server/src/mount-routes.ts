import { Express } from 'express';
import { login, logout, refreshToken } from './handlers/auth-handlers';
import { getMe, getUserLimitTracker, getUserTrackers } from './handlers/user-handlers';

const mountRoutes = (app: Express) => {

  app.get('/', (_, res) => {
    res.send("sudocoin to the moon.");
  });

  // mount auth routes

  app.post('/auth/login', login);
  app.post('/auth/logout', logout);
  app.post('/auth/refresh-token', refreshToken);

  // mount user routes

  app.get('/users/me', getMe);
  app.get('/users/tracker', getUserTrackers);
  app.get('/users/trackers/limit/:trackerId', getUserLimitTracker);
}

export default mountRoutes;
