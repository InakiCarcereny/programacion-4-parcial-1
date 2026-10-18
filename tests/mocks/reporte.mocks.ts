import type {
  Id,
  Pedido,
  ProductoBasico,
  ReporteDependencias,
} from "../../src/services/reporte.service";

export const productosMock: ProductoBasico[] = [
  { id: 1, nombre: "Espresso" },
  { id: 2, nombre: "Filtrado" },
  { id: 3, nombre: "Muffin de chocolate" },
];

const precios: Record<string, number> = { "1": 5740, "2": 4280, "3": 2500 };

export const pedidosMock: Pedido[] = [
  {
    id: 1,
    estado: "entregado",
    items: [
      { productoId: 1, cantidad: 2 },
      { productoId: 3, cantidad: 1 },
    ],
  },
  { id: 2, estado: "entregado", items: [{ productoId: 2, cantidad: 3 }] },
  {
    id: 3,
    estado: "pendiente",
    items: [
      { productoId: 1, cantidad: 1 },
      { productoId: 3, cantidad: 3 },
    ],
  },
];

export const FACTURACION_MOCK = 40060;

export function crearDependenciasMock(pedidos: Pedido[] = pedidosMock): ReporteDependencias {
  return {
    listarPedidos: () => pedidos,
    calcularTotalPedido: (pedido) =>
      pedido.items.reduce((acc, item) => acc + precios[String(item.productoId)] * item.cantidad, 0),
    buscarProductoPorId: (id: Id) => productosMock.find((p) => p.id === id),
  };
}
