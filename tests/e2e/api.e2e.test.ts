import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app";

const app = createApp();

describe("E2E API", () => {
  it("GET /health responde 200 con estado ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
  });

  it("GET /products devuelve el catálogo completo con el contrato esperado", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
    for (const product of res.body) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          basePrice: expect.any(Number),
          finalPrice: expect.any(Number),
        }),
      );
    }
  });

  it("GET /products/:id devuelve un producto existente y 404 si no existe", async () => {
    const found = await request(app).get("/products/Pastry-1");
    expect(found.status).toBe(200);
    expect(found.body).toEqual(
      expect.objectContaining({
        id: "Pastry-1",
        name: "Muffin de chocolate",
        basePrice: 2500,
        finalPrice: 2500,
      }),
    );

    const missing = await request(app).get("/products/Producto-inexistente");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: "Producto Producto-inexistente no encontrado" });
  });

  it("GET /reportes/facturacion responde 0 cuando no hay ventas", async () => {
    const res = await request(app).get("/reportes/facturacion");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facturacionTotal: 0 });
  });

  it("GET /reportes/mas-vendido responde 404 cuando no hay ventas", async () => {
    const res = await request(app).get("/reportes/mas-vendido");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No hay ventas registradas" });
  });

  it("GET /orders arranca vacío", async () => {
    const res = await request(app).get("/orders");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /orders crea una orden con el contrato esperado", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 2 }] });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: "Order-1",
      items: [{ productId: "Pastry-1", quantity: 2 }],
      status: "pending",
      total: 5000,
    });
  });

  it("GET /orders/:id devuelve la orden creada y GET /orders la lista", async () => {
    const byId = await request(app).get("/orders/Order-1");
    expect(byId.status).toBe(200);
    expect(byId.body).toEqual({
      id: "Order-1",
      items: [{ productId: "Pastry-1", quantity: 2 }],
      status: "pending",
      total: 5000,
    });

    const list = await request(app).get("/orders");
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe("Order-1");
  });

  it("GET /reportes/facturacion suma el total de las órdenes creadas", async () => {
    const res = await request(app).get("/reportes/facturacion");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ facturacionTotal: 5000 });
  });

  it("GET /reportes/mas-vendido devuelve el producto más vendido", async () => {
    const res = await request(app).get("/reportes/mas-vendido");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ producto: "Muffin de chocolate", cantidad: 2 });
  });

  it("POST /orders rechaza payloads inválidos con 400/404", async () => {
    const sinItems = await request(app).post("/orders").send({});
    expect(sinItems.status).toBe(400);
    expect(sinItems.body).toEqual({ error: "Order must have at least one item" });

    const cantidadInvalida = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Pastry-1", quantity: 0 }] });
    expect(cantidadInvalida.status).toBe(400);
    expect(cantidadInvalida.body).toEqual({ error: "Invalid quantity for product Pastry-1" });

    const productoInexistente = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "Producto-inexistente", quantity: 1 }] });
    expect(productoInexistente.status).toBe(404);
    expect(productoInexistente.body).toEqual({ error: "Product Producto-inexistente not found" });
  });

  it("GET /orders/:id inexistente responde 404", async () => {
    const res = await request(app).get("/orders/Order-999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Order Order-999 not found" });
  });

  it("POST /orders con JSON inválido responde 400", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Content-Type", "application/json")
      .send("{ no es json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "invalid JSON" });
  });

  it("una ruta desconocida responde 404", async () => {
    const res = await request(app).get("/ruta-inexistente");

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/);
  });
});
