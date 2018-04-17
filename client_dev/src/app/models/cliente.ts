import { NotasCliente } from './notascliente';
import { RangoEdades } from './rangoedades';

export class Cliente {
    constructor(
        public _id: string,
        public nombre: string,
        public notascliente: Array<NotasCliente>,
        public cumpleanios: Date,
        public correoelectronico: string,
        public tienehijos: Boolean,
        public rangoedadeshijos: Array<RangoEdades>,
        public debaja: boolean
    ) {}
}
