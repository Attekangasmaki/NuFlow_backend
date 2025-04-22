import express from 'express';
import { authenticateToken } from '../../middlewares/authentication.js';
import { getLatestKubiosHrvValues, getAllKubiosHrvValues, getUserInfo, updateKubiosUserInfo, getKubiosHrvValuesLastMonth, getKubiosHrvValuesLastWeek, getKubiosHrvValuesByDate, getKubiosLast7Measurements, getKubiosLast30Measurements } from '../controllers/kubios-controller.js';
import { body } from 'express-validator';

const kubiosRouter = express.Router();

/**
 * @api {get} /hrv/latest Get latest Kubios HRV values
 * @apiName GetLatestKubiosHrv
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object} hrv HRV measurement data.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/latest', authenticateToken, getLatestKubiosHrvValues)

/**
 * @api {get} /hrv/all Get all Kubios HRV values
 * @apiName GetAllKubiosHrv
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object[]} hrv List of all HRV measurements.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/all', authenticateToken, getAllKubiosHrvValues)

/**
 * @api {get} /user-info Get current user's Kubios info
 * @apiName GetKubiosUserInfo
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object} user User info object.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/user-info', authenticateToken, getUserInfo)

/**
 * @api {get} /hrv/last-week Get Kubios HRV values for the last week
 * @apiName GetKubiosHrvLastWeek
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object[]} hrv HRV values from the past 7 days.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/last-week', authenticateToken, getKubiosHrvValuesLastWeek)

/**
 * @api {get} /hrv/last-month Get Kubios HRV values for the last month
 * @apiName GetKubiosHrvLastMonth
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object[]} hrv HRV values from the past 30 days.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/last-month', authenticateToken, getKubiosHrvValuesLastMonth)

/**
 * @api {get} /hrv/by-date/:date Get Kubios HRV values by date
 * @apiName GetKubiosHrvByDate
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiParam {String} date Date in format YYYY-MM-DD
 *
 * @apiSuccess {Object} hrv HRV value for the specified date.
 * @apiError (400) BadRequest Invalid date format.
 * @apiError (404) NotFound No data found for the given date.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/by-date/:date', authenticateToken, getKubiosHrvValuesByDate)

/**
 * @api {get} /hrv/last-7-measurements Get the last 7 Kubios HRV measurements
 * @apiName GetKubiosLast7Measurements
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object[]} hrv List of last 7 HRV entries.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/last-7-measurements', authenticateToken, getKubiosLast7Measurements)

/**
 * @api {get} /hrv/last-30-measurements Get the last 30 Kubios HRV measurements
 * @apiName GetKubiosLast30Measurements
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiSuccess {Object[]} hrv List of last 30 HRV entries.
 * @apiError (401) Unauthorized Missing or invalid token.
 */
kubiosRouter.get('/hrv/last-30-measurements', authenticateToken, getKubiosLast30Measurements)




/**
 * @api {patch} /userinfo Update current user's info
 * @apiName PatchUserInfo
 * @apiGroup Kubios
 * @apiPermission user
 *
 * @apiDescription
 * Updates user profile fields in Kubios-style. All fields are optional, but at least one must be provided.
 *
 * @apiBody {String} [given_name] User's first name.
 * @apiBody {String} [family_name] User's last name.
 * @apiBody {String} [phone_number] Phone number in international format (e.g. +358...).
 * @apiBody {Float} [weight] Weight in kilograms. Must be positive.
 * @apiBody {Float} [height] Height in meters. Must be positive.
 * @apiBody {Integer} [hr_max] Maximum heart rate. Must be a positive integer.
 * @apiBody {Integer} [hr_rest] Resting heart rate. Must be a positive integer.
 * @apiBody {Float} [vo2max] VO2 max value. Must be positive.
 * @apiBody {String="male","female","other"} [gender] Gender identifier.
 * @apiBody {Date} [birthdate] Date of birth in ISO 8601 format (YYYY-MM-DD).
 * @apiBody {String} [company_name] Name of the company.
 *
 * @apiSuccess (200) {String} message Update successful
 * @apiError (400) {Object} error Validation error or no fields provided
 * @apiError (401) {String} error Unauthorized
 */
kubiosRouter.route('/userinfo')
  .patch(
    body('given_name').optional().isString(),
    body('family_name').optional().isString(),
    body('phone_number').optional().isString(),
    body('weight').optional().isFloat({ min: 0 }),
    body('height').optional().isFloat({ min: 0 }),
    body('hr_max').optional().isInt({ min: 0 }),
    body('hr_rest').optional().isInt({ min: 0 }),
    body('vo2max').optional().isFloat({ min: 0 }),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('birthdate').optional().isISO8601().withMessage('Invalid birthdate format'),
    body('company_name').optional().isString(),
    authenticateToken,
    updateKubiosUserInfo);




export default kubiosRouter;
