import { Request, Response } from "express";
import trackerModel from "../models/tracker";
import limitTrackerModel from "../models/limit-tracker";

export const getMe = async (_: Request, res: Response) => {
  const user = res.locals.user;
  return res.status(200).json({
    user,
  });
};

export const getUserTrackers = async (_: Request, res: Response) => {
  const user = res.locals.user;
  console.log(user);
  const trackers = await trackerModel.find({ user_id: user.user_id }).exec();
  return res.status(200).json({
    trackers,
  });
};

export const createCoinTracker = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const coingeckoId = req.params.coingeckoId;
  if (!coingeckoId) {
    return res.status(400).json({ error: "coingeckoId or trackerId missing" });
  }
  try {
    const tracker = await trackerModel.create({
      user_id: user.user_id,
      coingecko_id: coingeckoId,
    });
    await tracker.save();
    return res.status(200).json({
      tracker,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getUserLimitTracker = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const trackerId = req.params.trackerId;
  const limitTracker = limitTrackerModel
    .findOne({ user_id: user.user_id, tracker_id: trackerId })
    .exec();
  return res.status(200).json({
    limitTracker,
  });
};

export const createLimitTracker = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const trackerId = req.params.trackerId;
  const lowLimit = req.body.low;
  const highLimit = req.body.high;

  if (!trackerId || !lowLimit || !highLimit) {
    return res
      .status(400)
      .json({ error: "trackerId missing or invalid limits" });
  }
  try {
    const tracker = await trackerModel
      .findOne({ user_id: user.user_id, tracker_id: trackerId })
      .exec();
    if (!tracker) {
      return res
        .status(400)
        .json({
          error:
            "tracker not found, can only track limits of existing trackers.",
        });
    }
    const ltracker = await limitTrackerModel.create({
      user_id: user.user_id,
      coingecko_id: tracker.coingecko_id,
      tracker_id: trackerId,
      lower_limit: lowLimit,
      upper_limit: highLimit,
    });
    await ltracker.save();
    return res.status(200).json({
      limitTracker: ltracker,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
