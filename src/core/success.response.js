const StatusCode = {
  OK: 200,
  CREATED: 201,
};
const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created successfully",
};
class successResponse {
  constructor(
    message ,
    statusCode = StatusCode.OK,
    resonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  ) {
    this.message = message || resonStatusCode;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}
class OK extends successResponse {
  constructor({ message, metadata }) {
    super(message, StatusCode.OK, ReasonStatusCode.OK, metadata);
  }
}
class Created extends successResponse {
  constructor({options,  message, statusCode = StatusCode.CREATED ,resonStatusCode = ReasonStatusCode.CREATED, metadata}) {
    super(message, statusCode, resonStatusCode, metadata);
    this.options = options;
  }
}

export { OK, Created };
