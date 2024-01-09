import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { Prontuario } from 'src/app/models/Prontuarios';


@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {


 constructor(private http: HttpClient) { }

 private apiurl = `${environment.ApiUrl}/Prontuario`
 public prontuarioG: Prontuario[] = [];


  GetProntuario() : Observable<Response<Prontuario[]>>{
    return this.http.get<Response<Prontuario[]>>(this.apiurl);
  }
  CreateProntuario(prontuario: Prontuario) : Observable<Response<Prontuario[]>>{
    return this.http.post<Response<Prontuario[]>>(`${this.apiurl}` , prontuario);
  }
  UpdateProntuario(prontuario: Prontuario) : Observable<Response<Prontuario[]>>{
    return this.http.put<Response<Prontuario[]>>(`${this.apiurl}/Editar` , prontuario);
  }
  GetProntuarioByTipo(tipo: string): Observable<Response<Prontuario[]>> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<Response<Prontuario[]>>(`${this.apiurl}/tipo`, { params });
  }

}
