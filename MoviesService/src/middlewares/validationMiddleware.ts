import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../types/HttpException';
import HttpStatuses from '../constants/HttpStatuses';

function validationMiddleware(type: any): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => {
              if (error.constraints) return Object.values(error.constraints);
            })
            .join(', ');
          next(new HttpException(HttpStatuses.BAD_REQUEST, message));
        } else {
          next();
        }
      },
    );
  };
}

export default validationMiddleware;
