import { selectMetricByUserId, insertHealthmetrics, updateHealthmetrics } from '../models/metrics-model.js';


// Controller-funktio, joka hakee käyttäjän metricit ID:n perusteella
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


//Controller-funktio, joka hakee käyttäjän metricit käyttäjätunnuksen perusteella
const getMetricByUserId = async (req, res, next) => {
  console.log('getMetricById', req.user.userId);
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


//Controller-funktio, joka lisää uuden metricin
const postMetric = async (req, res, next) => {
  const newMetric = req.body;
  console.log("User ID from token:", req.user?.user_id);// Oletetaan, että käyttäjä-ID saadaan käyttäjän tokenista
  newMetric.user_id = req.user.userId;

  try {
    console.log('Adding Metric:', newMetric);
    const insertId = await insertHealthmetrics(newMetric); // Insert toimii ilman next:tä
    res.status(201).json({ message: "Metric added successfully", insertId: insertId });
  } catch (error) {
    next(error); // Virhe siirretään Expressin virheenkäsittelyyn
  }
};

//Controller-funktio, joka päivittää olemassa olevan metricin
const putMetric = async (req, res, next) => {
  const metricId = req.params.id;
  const metricData = req.body;

  // userId JWT-tokenista
  metricData.user_id = req.user.userId;

  try {
    const result = await updateHealthmetrics(metricId, metricData);
    res.json({ message: "Metric updated successfully", result });
  } catch (error) {
    next(error);
  }
};

export { getMetricByUserId, getMetricById, postMetric, putMetric };
