import { selectMetricByUserId, insertHealthmetrics, updateHealthmetrics } from '../models/metrics-model.js';

const getMetricById = async (req, res, next) => {
  console.log('getMetricById', req.params.id);
  try {
    const metric = await selectMetricByUserId(req.params.id);
    console.log('Metric found:', metric);
    if (metric.length > 0) {
      res.json(metric);
    } else {
      res.status(404).json({ message: "Metrics not found" });
    }
  } catch (error) {
    next(error);
  }
};



const getMetricByUserId = async (req, res, next) => {
  console.log('getMetricById', req.user.user_id);
  try {
    const metric = await selectMetricByUserId(req.user.user_id);
    console.log('Metric found:', metric);
    if (metric.length > 0) {
      res.json(metric);
    } else {
      res.status(404).json({ message: "Metrics not found" });
    }
  } catch (error) {
    next(error);
  }
};

const postMetric = async (req, res, next) => {
  const newMetric = req.body;
  newMetric.user_id = req.user.user_id; // Oletetaan, että käyttäjä-ID saadaan käyttäjän tokenista

  try {
    console.log('Adding Metric:', newMetric);
    await insertHealthmetrics(newMetric);
    res.status(201).json({ message: "Metric added successfully" });
  } catch (error) {
    next(error);
  }
};

const putMetric = async (req, res, next) => {
  try {
    await updateHealthmetrics(req.params.id, req.body);
    res.json({ message: "Metrics updated successfully" });
  } catch (error) {
    next(error);
  }
};



export { getMetricByUserId, getMetricById, postMetric, putMetric };
