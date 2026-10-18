import { describe, expect, it } from "vitest";
import { ReporteService } from "../../src/services/reporte.service";
import { crearDependenciasMock, FACTURACION_MOCK } from "../mocks/reporte.mocks";

describe("ReporteService", () => {
  describe("facturacionTotal", () => {
    it("suma los totales de todos los pedidos", async () => {
      const service = new ReporteService(crearDependenciasMock());
      expect(await service.facturacionTotal()).toBe(FACTURACION_MOCK);
    });

    it("devuelve 0 si no hay pedidos", async () => {
      const service = new ReporteService(crearDependenciasMock([]));
      expect(await service.facturacionTotal()).toBe(0);
    });
  });

  describe("cantidadVendidaPorProducto", () => {
    it("agrupa las cantidades por nombre de producto", async () => {
      const service = new ReporteService(crearDependenciasMock());
      expect(await service.cantidadVendidaPorProducto()).toEqual({
        Espresso: 3,
        Filtrado: 3,
        "Muffin de chocolate": 4,
      });
    });

    it("devuelve un objeto vacío si no hay pedidos", async () => {
      const service = new ReporteService(crearDependenciasMock([]));
      expect(await service.cantidadVendidaPorProducto()).toEqual({});
    });

    it("falla si un pedido referencia un producto inexistente", async () => {
      const deps = crearDependenciasMock([
        { id: 9, estado: "pendiente", items: [{ productoId: 999, cantidad: 1 }] },
      ]);
      const service = new ReporteService(deps);
      await expect(service.cantidadVendidaPorProducto()).rejects.toThrow(
        "Producto 999 no encontrado",
      );
    });
  });

  describe("productoMasVendido", () => {
    it("devuelve el producto con más unidades vendidas", async () => {
      const service = new ReporteService(crearDependenciasMock());
      expect(await service.productoMasVendido()).toEqual({
        producto: "Muffin de chocolate",
        cantidad: 4,
      });
    });

    it("devuelve null si no hay ventas", async () => {
      const service = new ReporteService(crearDependenciasMock([]));
      expect(await service.productoMasVendido()).toBeNull();
    });
  });
});
