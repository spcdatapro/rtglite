import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

import { Cliente } from '../models/cliente';
import { TelefonoCliente } from '../models/telefonocliente';

@Injectable()
export class ClienteService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url + 'cli/';
    }

    listaClientes(token, pagina?: number, buscar?: String) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(
            this.url + 'lstclientes' + (pagina ? ('/' + pagina) : '/1') + (buscar ? ('/' + buscar) : ''),
            { headers: headers }).map(res => res.json()
        );
    }

    crear(clienteNuevo, token) {
        const params = JSON.stringify(clienteNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'c', params, { headers: headers }).map(res => res.json());
    }

    async crearAsync(clienteNuevo, token) {
        const params = JSON.stringify(clienteNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response = await this._http.post(this.url + 'c', params, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.entidad) {
                return null;
            }
            return res.entidad;
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    crearPaqueteCliente(cliente, telefono, direccion, factura, token) {
        const params = {
            cliente: cliente,
            telefono: telefono,
            direccion: direccion,
            factura: factura
        };

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cp', JSON.stringify(params), { headers: headers }).map(res => res.json());
    }

    async crearPaqueteClienteAsync(cliente, telefono, direccion, factura, token): Promise<any> {
        const params = {
            cliente: cliente,
            telefono: telefono,
            direccion: direccion,
            factura: factura
        };

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response = await this._http.post(this.url + 'cp', JSON.stringify(params), { headers: headers }).toPromise();
            const res = response.json();
            if (!res.entidad) {
                return null;
            }
            return res.entidad;
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    modificar(cliente, token) {
        const params = JSON.stringify(cliente);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'u/' + cliente._id, params, { headers: headers }).map(res => res.json());
    }

    eliminar(cliente, token) {
        const params = JSON.stringify(cliente);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'd/' + cliente._id, params, { headers: headers }).map(res => res.json());
    }

    getClienteById(idcliente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getcliente/' + idcliente, { headers: headers }).map(res => res.json());
    }

    getClienteByTelefono(telcliente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getclibytel/' + telcliente, { headers: headers }).map(res => res.json());
    }

    async getCliByTelAsync(telcliente: string, token: string): Promise<Cliente> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response = await this._http.get(this.url + 'getclibytel/' + telcliente, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.lista || res.lista.length === 0) {
                return null;
            }
            return res.lista[0];
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    // Teléfonos del cliente
    crearTelefono(telefonoNuevo, token) {
        const params = JSON.stringify(telefonoNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'ctel', params, { headers: headers }).map(res => res.json());
    }

    getTelefonosCliente(idcliente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'gettelscli/' + idcliente, { headers: headers }).map(res => res.json());
    }

    getTelefonoClienteNumtel(idcliente, telefono, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'gettelbyidclinum/' + idcliente + '/' + telefono, { headers: headers }).map(res => res.json());
    }

    async getTelefonoClienteNumtelAsync(idcliente, telefono, token): Promise<TelefonoCliente> {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        try {
            const response =
            await this._http.get(this.url + 'gettelbyidclinum/' + idcliente + '/' + telefono, { headers: headers }).toPromise();
            const res = response.json();
            if (!res.entidad) {
                return null;
            }
            return res.entidad;
        } catch (error) {
            await console.log('ERROR: ', error);
        }
    }

    getTelefonoCliente(identidad, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'gettelcli/' + identidad, { headers: headers }).map(res => res.json());
    }

    modificarTelefonoCliente(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'utel/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarTelefonoCliente(identidad, token) {
        const params = JSON.stringify({ _id: identidad, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'dtel/' + identidad, params, { headers: headers }).map(res => res.json());
    }

    // Direcciones del cliente
    crearDireccion(direccionNueva, token) {
        const params = JSON.stringify(direccionNueva);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cdir', params, { headers: headers }).map(res => res.json());
    }

    getDireccionesCliente(idcliente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdirscli/' + idcliente, { headers: headers }).map(res => res.json());
    }

    getDireccionCliente(identidad, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdircli/' + identidad, { headers: headers }).map(res => res.json());
    }

    modificarDireccionCliente(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'udir/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarDireccionCliente(identidad, token) {
        const params = JSON.stringify({ _id: identidad, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'ddir/' + identidad, params, { headers: headers }).map(res => res.json());
    }

    // Datos de facturación del cliente
    crearDatoFacturaCliente(datofactNuevo, token) {
        const params = JSON.stringify(datofactNuevo);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'cdfact', params, { headers: headers }).map(res => res.json());
    }

    getDatosFacturaCliente(idcliente, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdfact/' + idcliente, { headers: headers }).map(res => res.json());
    }

    getDatoFacturaCliente(identidad, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'getdf/' + identidad, { headers: headers }).map(res => res.json());
    }

    modificarDatoFacturaCliente(entidad, token) {
        const params = JSON.stringify(entidad);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'udfact/' + entidad._id, params, { headers: headers }).map(res => res.json());
    }

    eliminarDatoFacturaCliente(identidad, token) {
        const params = JSON.stringify({ _id: identidad, debaja: true });
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'ddfact/' + identidad, params, { headers: headers }).map(res => res.json());
    }
}
