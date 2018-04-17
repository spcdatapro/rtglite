export class DatoFacturaCliente {
    constructor(
        public _id: string,
        public idcliente: string,
        public nit: string,
        public nombre: string,
        public direccion: string,
        public debaja: boolean
    ) { }
}
