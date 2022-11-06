export class InternalServerError extends Error {
  constructor (error, status = 500) {
    super();
    this.error = error;
    this.status = status;
  }
}

export class MongooseInvalidDataError extends Error {
  constructor (error, status = 400) {
    super();
    this.error = error;
    this.status = status;
  }
}

export class UnAuthorizationError extends Error {
  constructor (error, status = 401) {
    super();
    this.error = error;
    this.status = status;
  }
}