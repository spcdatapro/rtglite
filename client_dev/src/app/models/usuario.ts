import { RolUsuario } from './rolusuario';
import { Restaurante } from './restaurante';

export class Usuario {
    constructor(
        public _id: string,
        public nombre: string,
        public usuario: string,
        public correoe: string,
        public contrasenia: string,
        public roles: Array<RolUsuario>,
        public restaurante: Array<Restaurante>,
        public debaja: boolean
    ) {}
}
