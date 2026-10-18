import type { Request, Response } from "express";
import type { ReporteService } from "../services/reporte.service";

export class ReporteController {
  constructor(private readonly service: ReporteService) {}

  facturacion = async (_req: Request, res: Response): Promise<void> => {
    try {
      const facturacionTotal = await this.service.facturacionTotal();
      res.status(200).json({ facturacionTotal });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  masVendido = async (_req: Request, res: Response): Promise<void> => {
    try {
      const resultado = await this.service.productoMasVendido();
      if (resultado === null) {
        res.status(404).json({ error: "No hay ventas registradas" });
        return;
      }
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
