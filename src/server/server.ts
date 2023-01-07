import express, { Express } from "express";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import routesV1 from "routes/v1";
import routesV2 from "routes/v2";

export function setupServer(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", routesV1);
  app.use("/api/v2", routesV2);

  app.use(handleErrorMiddleware);

  return app;
}
