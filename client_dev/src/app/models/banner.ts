export class Banner {
    constructor(
        public _id: string,
        public banner: string,
        public espermanente: boolean,
        public fechadel: Date,
        public fechaal: Date,
        public fechacrea: Date,
        public idusrcrea: string,
        public fechamod: Date,
        public idusrmod: string,
        public debaja: boolean
    ) { }
}
