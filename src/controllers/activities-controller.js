import { insertActivity, updateActivity, delActivity, selectActivityById } from '../models/activities-model.js';

const getActivityById = async (req, res, next) => {
  console.log('getEntryById', req.params.id);
  try{
    const activity = await selectActivityById(req.params.id);
    console.log('Activity found:', activity)
    if (activity) {
      res.json(activity);
    } else {
      res.status(404).json({message: "Activity not found"});
    }
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
  res.status(201)({message: 'Activity added'});
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
export {getActivityById, postActivity, putActivity, deleteActivity};
