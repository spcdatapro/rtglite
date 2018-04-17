import { DetalleCobro } from './detcobro';

export class DetalleCobroComanda {
    constructor(
        public idformapago: string,
        public descripcion: string,
        public estarjeta: boolean,
        public detcobro: Array<DetalleCobro>,
        public condocumento: boolean,
        public escortesia: boolean,
        public debaja: boolean
    ) { }
}
