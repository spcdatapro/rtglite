import { DetalleComanda } from './detallecomanda';

export class MenuRestaurante {
    constructor(
        public _id: string,
        public descripcion: string,
        public idpadre: string,
        public nivel: number,
        public precio: number,
        public tienecomponentes: boolean,
        public precioextra: number,
        public tieneextras: boolean,
        public limitecomponentes: number,
        public espromocion: boolean,
        public itemspromo: Array<DetalleComanda>,
        public debaja: boolean,
        public descripcionfull?: string
    ) {}
}
