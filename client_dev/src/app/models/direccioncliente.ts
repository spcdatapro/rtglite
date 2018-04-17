export class DireccionCliente {
    constructor(
        public _id: string,
        public idcliente: string,
        public idrestaurante: string,
        public idtipodireccion: string,
        public direccion: string,
        public zona: number,
        public colonia: string,
        public codigoacceso: string,
        public debaja: boolean
    ) {}
}
