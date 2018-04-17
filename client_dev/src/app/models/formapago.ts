export class FormaPago {
    constructor(
        public _id: string,
        public descripcion: string,
        public estarjeta: boolean,
        public escortesia: boolean,
        public condocumento: boolean,
        public orden: number,
        public debaja: boolean
    ) { }
}
