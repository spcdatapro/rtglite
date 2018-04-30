import { DetalleComanda } from './detallecomanda';
import { DetalleCobroComanda } from './detcobrocomanda';
import { DetalleFacturarA } from './detfacturara';
import { BitacoraEstatus } from './bitacoraestatus';

export class Comanda {
    constructor(
        public _id: string,
        public idcliente: string,
        public idtelefonocliente: string,
        public iddireccioncliente: string,
        public iddatosfacturacliente: string,
        public fecha: Date,
        public idtipocomanda: string,
        public idusuario: string,
        public fechainitoma: Date,
        public fechafintoma: Date,
        public idestatuscomanda: string,
        public notas: string,
        public cantidaditems: number,
        public totalcomanda: number,
        public detallecomanda: Array<DetalleComanda>,
        public detcobrocomanda: Array<DetalleCobroComanda>,
        public detfacturara: Array<DetalleFacturarA>,
        public idtiempoentrega: string,
        public idrestaurante: string,
        public idmotorista: string,
        public imgpago: Array<string>,
        public bitacoraestatus: Array<BitacoraEstatus>,
        public tracking: number,
        public noorden: number,
        public debaja: boolean
    ) { }
}
