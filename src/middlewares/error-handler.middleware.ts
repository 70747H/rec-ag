import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else if(error instanceof ForbiddenError) {
    res.status(403).send({ name: "Forbidden", message });
  } else if(error instanceof UnauthorizedError) {
    res.status(401).send({ name: "Unauthorized", message });
  } else if(error instanceof BadRequestError){
    res.status(400).send({ name: "BadRequestError", message });
  } else if(error instanceof NotFoundError){
    res.status(404).send({ name: "NotFoundError", message });
  }else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
