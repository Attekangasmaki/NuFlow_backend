import { selectMetricById, insertMetric, updateMetric, delMetric } from '../models/metrics-model.js';

const getMetricById = async (req, res, next) => {
  console.log('getMetricById', req.params.id);
  try {
    const metric = await selectMetricById(req.params.id);
    console.log('Metric found:', metric);
    if (metric) {
      res.json(metric);
    } else {
      res.status(404).json({ message: "Metric not found" });
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
    await insertMetric(newMetric);
    res.status(201).json({ message: "Metric added successfully" });
  } catch (error) {
    next(error);
  }
};

const putMetric = async (req, res, next) => {
  try {
    await updateMetric(req.params.id, req.body);
    res.json({ message: "Metric updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMetric = async (req, res, next) => {
  try {
    await delMetric(req.params.id);
    res.json({ message: "Metric deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getMetricById, postMetric, putMetric, deleteMetric };
