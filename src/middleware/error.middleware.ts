import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationErrors from "../exceptions/validation.errors";
import logger from "../utils/winston.logger";
import { JsonWebTokenError } from "jsonwebtoken";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(error.stack);
    if (error instanceof JsonWebTokenError) {
      logger.error(`message:${error.message} `);
      res.status(403).send({ message: error.message });
    }
    if (error instanceof ValidationErrors) {
      logger.error(`status :${error.status} message:${error.message} `);
      res
        .status(error.status)
        .send({ message: error.message, errors: error.errors });
      return;
    } else if (error instanceof HttpException) {
      logger.error(`status :${error.status} message:${error.message} `);
      res.status(error.status).send({ error: error.message });
      return;
    } else res.status(500).send(error.message);
  } catch (err) {
    next(err);
  }
};

export default errorMiddleware;
