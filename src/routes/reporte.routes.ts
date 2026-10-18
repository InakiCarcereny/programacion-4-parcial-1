import { Router } from "express";
import type { ReporteController } from "../controllers/reporte.controller";

export function crearReporteRoutes(controller: ReporteController): Router {
  const router = Router();
  router.get("/facturacion", controller.facturacion);
  router.get("/mas-vendido", controller.masVendido);
  return router;
}
