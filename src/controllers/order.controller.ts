import { NextFunction, Request, Response } from "express";
import { products } from "@/data/products";
import { NotFoundError } from "@/errors/AppError";
import { createOrder, findOrderById, listOrders } from "@/services/order.service";
import type { OrderItem } from "@/types/order";

export function postOrder(req: Request, res: Response, next: NextFunction): void {
  try {
    const order = createOrder(req.body?.items as OrderItem[]);
    res.status(201).json(order.toJSON(products));
  } catch (error) {
    next(error);
  }
}

export function getOrders(_req: Request, res: Response): void {
  const orders = listOrders().map((order) => order.toJSON(products));
  res.json(orders);
}

export function getOrderById(req: Request, res: Response, next: NextFunction): void {
  const order = findOrderById(req.params.id);
  if (!order) {
    return next(new NotFoundError(`Order ${req.params.id} not found`));
  }

  res.json(order.toJSON(products));
}
