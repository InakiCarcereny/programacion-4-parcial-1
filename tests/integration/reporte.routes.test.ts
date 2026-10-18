import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ReporteController } from "../../src/controllers/reporte.controller";
import { crearReporteRoutes } from "../../src/routes/reporte.routes";
import { ReporteService } from "../../src/services/reporte.service";
import { crearDependenciasMock, FACTURACION_MOCK } from "../mocks/reporte.mocks";

function crearApp(pedidos?: Parameters<typeof crearDependenciasMock>[0]) {
  const app = express();
  app.use(express.json());
  const controller = new ReporteController(new ReporteService(crearDependenciasMock(pedidos)));
  app.use("/reportes", crearReporteRoutes(controller));
  return app;
}

describe("GET /reportes/facturacion", () => {
  it("responde 200 con la facturación total", async () => {
    const res = await request(crearApp()).get("/reportes/facturacion");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facturacionTotal: FACTURACION_MOCK });
  });

  it("responde 200 con 0 si no hay pedidos", async () => {
    const res = await request(crearApp([])).get("/reportes/facturacion");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facturacionTotal: 0 });
  });
});

describe("GET /reportes/mas-vendido", () => {
  it("responde 200 con el producto más vendido", async () => {
    const res = await request(crearApp()).get("/reportes/mas-vendido");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ producto: "Muffin de chocolate", cantidad: 4 });
  });

  it("responde 404 si todavía no hay ventas", async () => {
    const res = await request(crearApp([])).get("/reportes/mas-vendido");
    expect(res.status).toBe(404);
  });
});
