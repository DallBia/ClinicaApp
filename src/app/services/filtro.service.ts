import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Response } from '../models/Response';
import {Cliente} from '../models/Clientes';
@Injectable({
  providedIn: 'root'
})
export class FiltroService {

  constructor(private http: HttpClient,) { }

  GetClientebyFiltro(atr: string, par: string, ret: string): Promise<any> {
    const body = { atr: atr, par: par, ret: ret };
    const apiurllogin = `${environment.ApiUrl}/Cliente/Nome`;
    const urlWithParams = `${apiurllogin}?atr=${atr}&par=${par}&ret=${ret}`;
    return this.http.get<any>(urlWithParams).toPromise();
  }
}
