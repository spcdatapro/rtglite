export class PresupuestoVentas {
    constructor(
        public _id: string,
        public mes: number,
        public anio: number,
        public presupuesto: number,
        public debaja: boolean
    ) { }
}
