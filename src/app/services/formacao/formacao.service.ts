import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Formacao } from 'src/app/models/Formacaos';

@Injectable({
  providedIn: 'root'
})
export class FormacaoService {
public formacaos: Formacao[] = [];
public formacaoAtual: Formacao[] = [];
public Vazia: Formacao[] = [{
  id: 0,
  idFuncionario: 0,
  dtConclusao: '',
  nivel:'',
  registro: '',
  instituicao: '',
  nomeFormacao: '',
  areasRelacionadas: '',
}]



  constructor(private http: HttpClient) { }


  private apiurl = `${environment.ApiUrl}/Formacao`
  GetFormacao() : Observable<Response<Formacao[]>>{
    return this.http.get<Response<Formacao[]>>(this.apiurl);
  }


  async getFormacaoById(id: number): Promise<boolean> {
    try {
      this.formacaoAtual = [];
      const response = await this.http.get<Response<Formacao[]>>(`${this.apiurl}/id/${id}`).toPromise();
      this.delay(200)
      if (response && response.dados !== undefined && response.sucesso) {
        this.formacaoAtual = response.dados;
        return true;
      } else {
        console.log(response?.mensagem)
        return false;
      }
    } catch (error) {
      return false;
    }
  }
delay(time:number) {
    setTimeout(() => {

    }, time);
  }

  async getFormacao(): Promise<Formacao[]> {
    try {
      const response = await this.http.get<Response<Formacao[]>>(`${this.apiurl}`).toPromise();

      if (response && response.dados !== undefined && response.sucesso) {
        this.formacaos = response.dados
        return response.dados;
      } else {
        throw new Error('Erro no Formação Service');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }


  CreateFormacao(formacao: Formacao) : Observable<Response<Formacao[]>>{
    return this.http.post<Response<Formacao[]>>(`${this.apiurl}`, formacao);
  }

  async UpdateFormacao(formacao: Formacao) : Promise<Formacao[]>{
    console.log(formacao)

      const apiurllogin = `${environment.ApiUrl}/Formacao/Editar`;
      const response = await this.http.put<Response<Formacao[]>>(apiurllogin , formacao).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        this.formacaos = response.dados
        return response.dados;
      } else {
        throw new Error('Erro no Formação Service');
      }

  }

//   updateFormacao(formacao: Formacao[]) : Observable<Response<Formacao[]>>{
//     return this.http.put<Response<Formacao[]>>(`${this.apiurl}/Editar` , formacao);
// }

  private FormacaoAtual = new BehaviorSubject<Formacao>(this.Vazia[0]);
  FormacaoAtual$ = this.FormacaoAtual.asObservable();
  setFormacaoAtual(name: Formacao) {
    this.FormacaoAtual.next(name);
  }

  private FormacaoA = new BehaviorSubject<number>(0);
  FormacaoA$ = this.FormacaoA.asObservable();
  setFormacaoA(name: number) {
    this.FormacaoA.next(name);
  }

}
