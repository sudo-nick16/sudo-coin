import { Request, Response } from "express";
import trackerModel from "../models/tracker";
import limitTrackerModel from "../models/limit-tracker";

export const getMe = async (_: Request, res: Response) => {
  const user = res.locals.user;
  return res.status(200).json({
    user,
  })
}

export const getUserTrackers = async (_: Request, res: Response) => {
  const user = res.locals.user;
  const trackers = trackerModel.find({ user_id: user.user_id }).exec();
  return res.status(200).json({
    trackers,
  });
}

export const getUserLimitTracker = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const trackerId = req.params.trackerId;
  const limitTracker = limitTrackerModel.findOne({ user_id: user.user_id, tracker_id: trackerId }).exec();
  return res.status(200).json({
    limitTracker,
  });
}
