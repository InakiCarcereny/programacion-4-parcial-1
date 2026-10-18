import { NextFunction, Request, Response } from "express";
import { AppError, NotFoundError } from "@/errors/AppError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Ruta ${req.method} ${req.originalUrl} not found`));
}

function isBodyParserError(err: Error): err is Error & { status: number } {
  return (
    err instanceof SyntaxError &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
  );
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (isBodyParserError(err)) {
    res.status(err.status).json({ error: "invalid JSON" });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);

  res.status(500).json({ error: "Internal server error" });
}
