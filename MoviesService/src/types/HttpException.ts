class HttpException extends Error {
  status: number;
  message: string;
  constructor(status = 500, message = 'some error') {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
