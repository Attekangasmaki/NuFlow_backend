import { insertActivity, updateActivity, delActivity, selectActivityById, selectActivityByUserId } from '../models/activities-model.js';

const getActivityByUserId = async (req, res, next) => {
  console.log('getActivityById', req.user.user_id);
  try {
    const activity = await selectActivityByUserId(req.user.user_id);
    console.log('Activity found:', activity);
    if (activity.length > 0) {
      res.json(activity);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    next(error);
  }
};
const getActivityById = async (req, res, next) => {
  const activityId = req.params.id;
  console.log('Haetaan aktiviteetti ID:', activityId);

  try {
    const activity = await selectActivityById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

const postActivity = async (req, res, next) => {
  // req.user.user_id
  const newActivity = req.body;
  newActivity.user_id = req.user.user_id;
  try {
    console.log(newActivity);
    await insertActivity(newActivity);
    res.status(201).json({ message: 'Activity added' });
  } catch (error) {
    next(error);
  }
 };

 const putActivity = async (req, res) => {
  try {
    await updateActivity(req.params.id, req.body);
    res.json({ message: "Activity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    await delActivity(req.params.id);
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {getActivityByUserId, getActivityById, postActivity, putActivity, deleteActivity};
