export class ExtrasNotasComanda {
    constructor (
        public idcomponente: string,
        public esextra: boolean,
        public precio: number,
        public notas: string,
        public descripcion: string,
        public debaja: boolean
    ) { }
}
