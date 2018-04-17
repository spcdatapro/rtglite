import { ExtrasNotasComanda } from './extrasnotascomanda';

export class DetalleComponenteDetalleComanda {
    constructor(
        public idcomponente: string,
        public descripcion: string,
        public extrasnotas: Array<ExtrasNotasComanda>,
        public debaja: boolean
    ) { }
}
