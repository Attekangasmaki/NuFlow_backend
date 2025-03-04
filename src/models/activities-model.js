import promisePool from '../utils/database.js';

const selectActivityById = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("user ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM acticities WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Activity not found");
    }

    return rows[0];
  } catch (error) {
    next(error);
  }
};
const insertActivity = async (activity, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO diaryentries (user_id, activity_date, activity_type, duration_minutes, calories_burned, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [activity.user_id, activity.activity_date, activity.activity_type, activity.duration_minutes, activity.calories_burned, activity.notes],
    );
    console.log('insertActivity', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    next(error);
  }
};
const updateActivity = async (activityId, activity, next) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE diaryentries SET user_id = ?, acitivity_date = ?, activity_type = ?, duration_minutes = ?, calories_burned = ?, notes = ? WHERE acitvity_id = ?',
      [activity.user_id, activity.activity_date, activity.activity_type, activity.duration_minutes, activity.calories_burned, activity.notes, activityId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Activity not found or no changes made");
    }
    console.log('updateActivity', result);
    return result;
  } catch (error) {
    next(error);
  }
};

const delActivity = async (activityId, next) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM diaryentries WHERE entry_id = ?',
      [activityId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Activity not found");
    }
    console.log('delActivity', result);
    return result;
  } catch (error) {
    next(error);
  }
};

export { insertActivity, updateActivity, delActivity, selectActivityById};
