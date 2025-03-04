import promisePool from '../utils/database.js';

// Hakee metrit käyttäjän ID:n perusteella
const selectMetricById = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM healthmetrics WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      throw new Error("Metrics not found");
    }

    return rows;
  } catch (error) {
    next(error);
  }
};

// Lisää uuden metrin
const insertMetric = async (metric, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO healthmetrics (user_id, metric_date, blood_pressure, heart_rate, notes) VALUES (?, ?, ?, ?, ?)',
      [metric.user_id, metric.metric_date, metric.blood_pressure, metric.heart_rate, metric.notes],
    );
    console.log('insertMetric', result);
    return result.insertId;
  } catch (error) {
    next(error);
  }
};

// Päivittää olemassa olevan metrin
const updateMetric = async (metricId, metric, next) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE healthmetrics SET user_id = ?, metric_date = ?, blood_pressure = ?, heart_rate = ?, notes = ? WHERE metric_id = ?',
      [metric.user_id, metric.metric_date, metric.blood_pressure, metric.heart_rate, metric.notes, metricId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Metric not found or no changes made");
    }
    console.log('updateMetric', result);
    return result;
  } catch (error) {
    next(error);
  }
};

// Poistaa metrin ID:n perusteella
const delMetric = async (metricId, next) => {
  try {
    const [result] = await promisePool.query(
      'DELETE FROM healthmetrics WHERE metric_id = ?',
      [metricId]
    );
    if (result.affectedRows === 0) {
      throw new Error("Metric not found");
    }
    console.log('delMetric', result);
    return result;
  } catch (error) {
    next(error);
  }
};

export { selectMetricById, insertMetric, updateMetric, delMetric };
