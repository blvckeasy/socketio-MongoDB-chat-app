export class InternalServerError extends Error {
  constructor (error, status = 500) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class MongooseInvalidDataError extends Error {
  constructor (error, status = 406) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class UnAuthorizationError extends Error {
  constructor (error, status = 401) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class AuthenticationError extends Error {
  constructor (error, status = 401) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class BadGatewayError extends Error {
  constructor (error, status = 502) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class AlreadySignInError extends Error {
  constructor (error, status = 400) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class ForbiddenError extends Error {
  constructor (error, status = 403) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class NotFoundException extends Error {
  constructor (error, status = 404) {
    super();
    this.message = error;
    this.status = status;
  }
}

export class InvalidDataException extends Error {
  constructor (error, status = 405) {
    super();
    this.message = error;
    this.status = status;
  }
}