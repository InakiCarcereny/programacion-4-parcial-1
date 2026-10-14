import express, { type Express } from "express";
import { router } from "./routes";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/", router);

  return app;
}
