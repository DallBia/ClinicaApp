import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Financeiro } from 'src/app/models/Financeiro';
import { Response } from '../../models/Response';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TableData } from 'src/app/models/Tables/TableData';
import { Colaborador } from 'src/app/models/Colaboradors';
import { Tipo } from 'src/app/models/Tipo';
import { SharedService } from 'src/app/shared/shared.service';
import { UserService } from '..';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  public tabFinanceira: Financeiro[] = []
  public MostraInfo: boolean = true;
  public Atual!: TableData;
  public User!:Colaborador;
  public nCliente!: number;
  public info_Movimento: string = '';
  public info_Valor: string = '';
  public info_Credito: boolean = true;
  public info_Debito: boolean = false;
  public info_Data: string = '';
  public info_GeraPagto: string = '';
  public info_Descricao: string = '';
  public info_AtualizadoPor: string = '';
  public info_DataAt: string = '';
  public idLinha: number = 0;
  public ListaFuncionario: Tipo[] = [];
  public Usuário: string = '';
  public info_numAtualizadoPor: number = 0;
  public info_refAg: number = 0;
  public info_Recibo: string = '';

public entradas: string = 'R$ 0,00';
public saidas: string = 'R$ 0,00';
public saldo: string = 'R$ 0,00';
  troca(){
    this.info_Credito = !this.info_Credito
  }

  private ctrFinChange = new BehaviorSubject<boolean>(false);
  ctrFinChange$ = this.ctrFinChange.asObservable();
    setctrFinChange(name: boolean) {
    this.ctrFinChange.next(name);
  }
  constructor(private http: HttpClient,
    private shared: SharedService,
    private user: UserService,
    ) {


  }


public edicao: boolean = false;


AltCD(){
  this.info_Credito = !this.info_Credito
}
abrirEdicao(){

}

  private apiUrl = `${environment.ApiUrl}/Financeiro`;

  // updateFinanceiro(dado: Financeiro) : Observable<Response<Financeiro[]>>{
  //   return this.http.put<Response<Financeiro[]>>(`${this.apiUrl}/Editar` , dado);
  // }
  async updateFinanceiro(dado: Financeiro): Promise<Financeiro[]> {
    try {
      const response = await this.http.put<Response<Financeiro[]>>(`${this.apiUrl}/Editar` , dado).toPromise();

      if (response && response.dados !== undefined && response.sucesso) {
        return response.dados;
      } else {
        throw new Error('Resposta da API é indefinida, não contém dados ou não é bem-sucedida.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }

  async createFinanceiro(dado: Financeiro): Promise<Financeiro[]> {
    try {
      const response = await this.http.post<Response<Financeiro[]>>(`${this.apiUrl}` , dado).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        return response.dados;
      } else {
        throw new Error('Resposta da API é indefinida, não contém dados ou não é bem-sucedida.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }


  async getFinanceiroByAgenda(id: number): Promise<Financeiro> {
    try {
      const response = await this.http.get<Response<Financeiro>>(`${this.apiUrl}/Agenda/${id}`).toPromise();

      if (response && response.dados !== undefined && response.sucesso) {
        return response.dados;
      } else {
        throw new Error('Resposta da API é indefinida, não contém dados ou não é bem-sucedida.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }


  async getFinanceiroById(id: number): Promise<Financeiro[]> {
    try {
      const response = await this.http.get<Response<Financeiro[]>>(`${this.apiUrl}/Cliente/${id}`).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        this.tabFinanceira = response.dados;
        this.calcularBalanco()
        return response.dados;
      } else {
        throw new Error('Resposta da API é indefinida, não contém dados ou não é bem-sucedida.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }

calcularBalanco(){
  let entradas = 0;
  let saidas = 0;
  for (let i of this.tabFinanceira){
    if (i.valor == -1000009){
      i.valor = 0;
    }
    if(i.valor > 0){
      entradas += i.valor;
    }else{
      saidas += i.valor;
    }
  }
  let saldo = entradas + saidas
  this.entradas = this.formataNum(entradas)
  this.saidas = this.formataNum(saidas)
  this.saldo = this.formataNum(saldo)
}

formataNum(num: number): string{
  const numeroComDuasCasas: string = num.toFixed(2);
  let divid: string = Number(numeroComDuasCasas).toLocaleString('pt-BR');
  divid = divid + ',00';
  let Ad = divid.split(',')
  divid = 'R$ ' + Ad[0] + ',' + Ad[1]
  return divid
}
  zerar(){

  this.info_Movimento = '';
  this.info_Valor = '';
  this.info_Credito = true;
  this.info_Debito = false;
  this.info_Data = '';
  this.info_GeraPagto = '';
  this.info_Descricao = '';
  this.info_AtualizadoPor = this.Usuário;
  this.info_DataAt = '';
  this.info_numAtualizadoPor = 0;
  this.info_refAg = 0;
  this.idLinha = 0;
  this.info_Recibo = '';
  }
}
