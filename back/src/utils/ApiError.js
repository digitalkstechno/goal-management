class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const DEFAULT_MESSAGES = {
  200: "Success",
  201: "Created successfully",
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  500: "Internal server error",
};

const sendSuccess = (res, { statusCode = 200, message, data } = {}) => {
  const response = {
    success: true,
    statusCode,
    message: message || DEFAULT_MESSAGES[statusCode] || "Success",
  };
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
};

module.exports = ApiError;
module.exports.sendSuccess = sendSuccess;
module.exports.DEFAULT_MESSAGES = DEFAULT_MESSAGES;
