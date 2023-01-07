import { NextFunction, RequestHandler, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "errors/errors";

function dtoValidationMiddleware(type: any, requestSection: string, skipMissingProperties = false): RequestHandler {

  return (req: any, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const dtoObj = plainToInstance(type, req[requestSection]);
    validate(dtoObj, { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.map((error: ValidationError) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            (Object as any).values(error.constraints)).join(", ");
          next(new BadRequestError(dtoErrors));
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          req[requestSection] = dtoObj;
          next();
        }
      }
    );
  };
}

export default dtoValidationMiddleware;
