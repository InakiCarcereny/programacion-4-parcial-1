import { nextOrderId, orders } from "@/data/orders";
import { products } from "@/data/products";
import { AppError, NotFoundError } from "@/errors/AppError";
import { Order } from "@/models/Order";
import type { OrderItem } from "@/types/order";

function validateItems(items: OrderItem[]): void {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Orden tiene que tener por lo menos un item");
  }

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new AppError(`Cantidad invalidad para producto ${item.productId}`);
    }
    if (!products.some((product) => product.id === item.productId)) {
      throw new NotFoundError(`Producto ${item.productId} no encontrado`);
    }
  }
}

export function createOrder(items: OrderItem[]): Order {
  validateItems(items);
  const order = new Order(nextOrderId(), items);
  orders.push(order);
  return order;
}

export function listOrders(): Order[] {
  return orders;
}

export function findOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}
