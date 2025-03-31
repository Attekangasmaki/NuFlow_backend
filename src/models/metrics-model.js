import promisePool from '../utils/database.js';

// Hakee tiedot käyttäjän ID:n perusteella
const selectMetricByUserId = async (userId, next) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [rows] = await promisePool.query(
      'SELECT * FROM health_metrics WHERE user_id = ?',
      [userId]
    );

    return rows; // Palautetaan kaikki käyttäjän tiedot
  } catch (error) {
    next(error);
  }
};


// Lisää uuden metrin
const insertHealthmetrics = async (metric, next) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO health_metrics (user_id, drug_use, diseases_medications, sleep, self_assessment) VALUES (?, ?, ?, ?, ?)',
      [metric.user_id, metric.drug_use, metric.diseases_medications, metric.sleep, metric.self_assessment],
    );
    console.log('insertHealthMetrics', result);
    return result.insertId;
  } catch (error) {
    next(error);
  }
};


// Päivittää olemassa olevat tiedot metric_id:n perusteella
const updateHealthmetrics = async (metricId, metric, next) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE health_metrics SET user_id = ?, drug_use = ?, diseases_medications = ?, sleep = ?, self_assesment = ? WHERE metric_id = ?',
      [metric.user_id, metric.drug_use, metric.diseases_medications, metric.sleep, metric.self_assessment, metricId]
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


export { selectMetricByUserId, insertHealthmetrics, updateHealthmetrics };
