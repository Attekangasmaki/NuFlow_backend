import promisePool from '../utils/database.js';

const selectActivityByUserId = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM activities WHERE user_id = ?',
      [userId]
    );

    return rows; // Palautetaan kaikki käyttäjän aktiviteetit
  } catch (error) {
    next(error);
  }
};
const selectActivityById = async (activityId, next) => {
  try {
    if (!activityId) {
      throw new Error("Activity ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM activities WHERE activity_id = ?',
      [activityId]
    );

    return rows.length ? rows[0] : null; // Palautetaan yksi aktiviteetti
  } catch (error) {
    next(error);
  }
};
const insertActivity = async (activity, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO activities (user_id, activity_date, activity_type, duration_minutes, calories_burned, notes) VALUES (?, ?, ?, ?, ?, ?)',
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
      'UPDATE activities SET user_id = ?, activity_date = ?, activity_type = ?, duration_minutes = ?, calories_burned = ?, notes = ? WHERE acitvity_id = ?',
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
      'DELETE FROM activities WHERE activity_id = ?',
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

export { selectActivityByUserId, selectActivityById, insertActivity, updateActivity, delActivity };
