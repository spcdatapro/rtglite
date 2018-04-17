export class DetalleCobro {
    constructor(
        public monto: number,
        public porcentaje: number,
        public vueltopara: number,
        public vuelto: number,
        public idemisor: string,
        public estarjeta: boolean,
        public numero: string,
        public mesvence: number,
        public aniovence: number,
        public nombretarjeta: string,
        public aprobadopor: string,
        public condocumento: boolean,
        public numdocumento: string,
        public escortesia: boolean,
        public razoncortesia: string,
        public debaja: boolean
    ) { }
}
