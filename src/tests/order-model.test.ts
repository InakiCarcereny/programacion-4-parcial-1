import { describe, expect, it } from "vitest";
import { Order } from "@/models/Order";
import { products } from "@/data/products";

describe("Order", () => {
  it("calculates the total as the sum of price x quantity", () => {
    const order = new Order("Order-1", [{ productId: "Pastry-1", quantity: 2 }]);
    expect(order.calculateTotal(products)).toBe(5000);
  });

  it("calculates a mixed total across coffee and pastry", () => {
    const order = new Order("Order-2", [
      { productId: "Espresso-1", quantity: 1 },
      { productId: "Pastry-2", quantity: 2 },
    ]);
    expect(order.calculateTotal(products)).toBe(5020 + 8400);
  });

  it("starts with status pending by default", () => {
    const order = new Order("Order-3", [{ productId: "Pastry-1", quantity: 1 }]);
    expect(order.status).toBe("pending");
  });
});
