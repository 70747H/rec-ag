import { Request, Response, Router } from "express";

const routes = Router();

routes.get("/", function(_req: Request, res: Response) {
    res.send("v2 GET API");
  });

export default routes;
