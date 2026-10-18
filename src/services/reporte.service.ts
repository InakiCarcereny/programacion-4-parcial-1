export type Id = number | string;

export interface ItemPedido {
  productoId: Id;
  cantidad: number;
}

export interface Pedido {
  id: Id;
  items: ItemPedido[];
  estado: string;
}

export interface ProductoBasico {
  id: Id;
  nombre: string;
}

export interface MasVendido {
  producto: string;
  cantidad: number;
}

type MaybePromise<T> = T | Promise<T>;

export interface ReporteDependencias {
  listarPedidos: () => MaybePromise<Pedido[]>;
  calcularTotalPedido: (pedido: Pedido) => MaybePromise<number>;
  buscarProductoPorId: (id: Id) => MaybePromise<ProductoBasico | undefined>;
}

export class ReporteService {
  constructor(private readonly deps: ReporteDependencias) {}

  async facturacionTotal(): Promise<number> {
    const pedidos = await this.deps.listarPedidos();
    let total = 0;
    for (const pedido of pedidos) {
      total += await this.deps.calcularTotalPedido(pedido);
    }
    return total;
  }

  async cantidadVendidaPorProducto(): Promise<Record<string, number>> {
    const pedidos = await this.deps.listarPedidos();
    const resultado: Record<string, number> = {};

    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        const producto = await this.deps.buscarProductoPorId(item.productoId);
        if (!producto) {
          throw new Error(`Producto ${item.productoId} no encontrado`);
        }
        resultado[producto.nombre] = (resultado[producto.nombre] ?? 0) + item.cantidad;
      }
    }
    return resultado;
  }

  async productoMasVendido(): Promise<MasVendido | null> {
    const cantidades = await this.cantidadVendidaPorProducto();
    let mejor: MasVendido | null = null;

    for (const [producto, cantidad] of Object.entries(cantidades)) {
      if (mejor === null || cantidad > mejor.cantidad) {
        mejor = { producto, cantidad };
      }
    }
    return mejor;
  }
}
