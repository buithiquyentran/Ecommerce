const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD: 400,
};
const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
  BAD: "Bad request error",
};
class errorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
class conflictRequestError extends errorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT,
  ) {
    super(message, statusCode);
  }
}
class badRequestError extends errorResponse {
  constructor(
    message = ReasonStatusCode.BAD,
    statusCode = StatusCode.BAD,
  ) {
    super(message, statusCode);
  }
};
export { conflictRequestError, badRequestError };
