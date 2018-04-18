export class DiccionarioFox {
    constructor(
        public _id: string,
        public descripcion: string,
        public idmongodb: string,
        public idcomponente: string,
        public idfox: number,
        public detalle: number,
        public power: number,
        public idparticion: number,
        public idtipoprecio: number,
        public idmint: number
    ) { }
}
