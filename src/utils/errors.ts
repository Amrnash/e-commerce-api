export class HttpError extends Error {
  status: number;
  info?: any;

  constructor(status: number, message: string, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found", info?: any) {
    super(404, message, info);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", info?: any) {
    super(400, message, info);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", info?: any) {
    super(401, message, info);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error", info?: any) {
    super(500, message, info);
  }
}
