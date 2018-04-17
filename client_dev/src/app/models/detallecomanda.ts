import { DetalleComponenteDetalleComanda } from './detcompdetcomanda';
import { ExtrasNotasComanda } from './extrasnotascomanda';

export class DetalleComanda {
    constructor(
        public idmenurest: string,
        public cantidad: number,
        public precio: number,
        public notas: string,
        public descripcion: string,
        public componentes: Array<DetalleComponenteDetalleComanda>,
        public extrasnotas: Array<ExtrasNotasComanda>,
        public limitecomponentes: number,
        public tieneextras: boolean,
        public precioextra: number,
        public debaja: boolean
    ) { }
}
