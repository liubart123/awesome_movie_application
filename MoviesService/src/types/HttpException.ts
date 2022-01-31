import HttpStatuses from '../constants/HttpStatuses';

class HttpException extends Error {
  status: HttpStatuses;
  message: string;
  constructor(
    status = HttpStatuses.INTERNAL_SERVER_ERROR,
    message = 'some error',
  ) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
