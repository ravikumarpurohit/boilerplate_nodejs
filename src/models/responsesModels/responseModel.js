import { logger } from '../../utils/logger.js';
import { randomUUID } from 'crypto';

/*
Code:
0 = Error
5 = Success
6 = Logout
*/

/**
 * 
 * @param {string} message 
 * @param {array} results 
 * @param {number} statusCode 
 * @param {object} responseObj
 * @param {number} code
 */
const success = (message, results, statusCode, responseObj, code) => {
    return responseObj.status(statusCode).json({
        data: results,
        error: false,
        message,
        code,
    });
};

/**
 * 
 * @param {string} message 
 * @param {string} token 
 * @param {array} results 
 * @param {number} statusCode 
 * @param {object} responseObj
 * @param {number} code
 */
const successAuth = (message, token, results, statusCode, responseObj, code) => {
    return responseObj.status(statusCode).json({
        data: results,
        _token: token,
        error: false,
        message,
        code,
    });
};

/**
 * 
 * @param {string} message 
 * @param {number} statusCode 
 * @param {object} responseObj
 * @param {object} err
 */
const error = (message, statusCode, responseObj, err = {}) => {
    if (Object.keys(err).length > 0) {
        logger.error(message, responseObj.req.originalUrl, err);
    }

    return responseObj.status(statusCode).json({
        error: true,
        message,
        code: 0,
    });
};

/**
 * 
 * @param {string} message 
 * @param {object} errorData 
 * @param {number} statusCode 
 * @param {object} responseObj
 */
const exception = (message, statusCode, responseObj, errorData) => {
    message = message || errorData.message;
    const uniqueId = randomUUID();
    logger.fatal(uniqueId, responseObj.req.originalUrl, errorData);

    return responseObj.status(statusCode).json({
        error: true,
        message,
        details: `Please contact support team.\n Error-Refernce-Id: ${uniqueId}`,
        code: 0,
    });
};

export { success, successAuth, error, exception };
