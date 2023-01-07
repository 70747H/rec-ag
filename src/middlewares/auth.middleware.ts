import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "errors/errors";

export interface User {
    id: string,
    email: string
}

export interface CustomRequest extends Request {
    token: User;
   }

export function authenticateToken(_: Request, _res: Response, next: NextFunction) {
  const authHeader = _["headers"]["authorization"];
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) throw new UnauthorizedError("Unauthorized");

  if(token){
    verify(token, process.env.JWT_SECRET as string, (err: any, user: User) => {
    if (err) throw new ForbiddenError("Forbidden");
    (_ as CustomRequest).token = user;
    next()
    })
}
}
