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
import { Agenda } from 'src/app/models/Agendas';
import { TableFin } from 'src/app/models/Tables/TableFin';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {


  public NomeCliente: string = ''
  public tabFinanceira: TableFin[] = []
  public MostraInfo: boolean = true;
  public Atual!: TableData;
  public User!:Colaborador;
  public nCliente!: number;
  public info_Movimento: string = '';
  public info_Valor: number = 0;
  public info_Credito: boolean = true;
  public info_Debito: boolean = false;
  public info_Data: string = '';
  public info_GeraPagto: string = '';
  public info_Descricao: string = '';
  public info_AtualizadoPor: string = '';
  public info_DataAt: string = '';
  public idLinha: number = 0;
  public ListaFuncionario: Tipo[] = [];

  public ListaCliente: Tipo[] = [];
  public Usuário: string = '';
  public info_numAtualizadoPor: number = 0;
  public info_refAg: string = '0';
  public info_Recibo: string = '';
  public info_idUser: number = 0;
  public idUser: number = 0;
  public cliente: string = '';

  public info: TableFin = {
    id: 0,
  idAgenda: 0,
  idFinanceiro: 0,
  selecionada: false,
  dia: '',
  hora: '',
  servico: '',
  profis: '',
  valor: 0,
  pago: 0,
  dtPago: '',
  recibo: '',
  descricao: '',
  presenca: '',
  multi: '',
  ordem: '',
  }






  public filtro001: boolean = true; //checa se é só o cliente selecionado
  public filtro002: boolean = false; //checa se mostra pagtos efetuados
  public filtro003: string = ''; // data inicial
  public filtro004: string = ''; // data final
  public filtro005: boolean = false; //checa se mostra em aberto
  public filtro006: boolean = false; //checa se mostra pagos

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


  GetClientesByAgenda(param: string): Promise<Response<Tipo[]> | undefined>  {
    const API = `${environment.ApiUrl}/Cliente`
    return this.http.get<Response<Tipo[]>>(`${API}/Agenda/${param}`).toPromise();
  }
  async trazClientes(id: string): Promise<boolean>{

    try{
      const r = await this.GetClientesByAgenda(id)
      if (r?.dados && r.sucesso == true){
        this.ListaCliente = r.dados
      }

      return true
    }catch{
      return false
    }
  }

public edicao: boolean = false;


AltCD(){
  this.info_Credito = !this.info_Credito
}
abrirEdicao(){

}

Filtra(){
  console.log(this.filtro001)
  console.log(this.filtro002)
  console.log(this.filtro003)
  console.log(this.filtro004)
  console.log(this.filtro005)
  console.log(this.filtro006)
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
        throw new Error('Erro no update do Financeiro');
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
        throw new Error('Erro no Create do Financeiro.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }
  async getFinanceiroByCliente(id: number): Promise<Financeiro[]> {
    try {
      const response = await this.http.get<Response<Financeiro[]>>(`${this.apiUrl}/Cliente/${id}`).toPromise();

      if (response && response.dados !== undefined && response.sucesso) {
        return response.dados;
      } else {
        throw new Error('Erro no getFinanceiro by Agenda.');
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
        throw new Error('Erro no getFinanceiro by Agenda.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }

  async validarSaldo(valor: Tipo): Promise<string> {
    try {
      const response = await this.http.put<Response<Financeiro>>(`${this.apiUrl}/Saldo` , valor).toPromise();

      if (response && response.dados !== undefined && response.sucesso) {
        return response.mensagem;
      } else {
        throw new Error('Erro no update do Financeiro');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }


  newInfo(opt: boolean){
    let id = 0;
    const idA = window.sessionStorage.getItem('nCli');
      if (idA !== null){
        id = idA !== '' ? parseInt(idA) : 0;
      }
      const r = this.trazClientes('nome')

    if (id == 0){
      alert ('Você deve primeiro selecionar um cliente na guia FICHA DE CLIENTES')
    }else{
      this.MostraInfo = !opt;
      if(this.MostraInfo == false){
        this.tabFinanceira.forEach(s => s.selecionada = false);
        this.zerar();
      }else{
        for (let a of this.tabFinanceira){
          if (a.selecionada == true){
            this.info = a;
          }
        }
      }
    }
  }


calcularBalanco(){
  let entradas = 0;
  let saidas = 0;
  for (let i of this.tabFinanceira){
    if (i.valor == null){
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
    this.info_idUser = this.idUser;
  this.info_Movimento = '';
  this.info_Valor = 0;
  this.info_Credito = true;
  this.info_Debito = false;
  this.info_Data = '';
  this.info_GeraPagto = '';
  this.info_Descricao = '';
  this.info_AtualizadoPor = this.Usuário;
  this.info_DataAt = '';
  this.info_numAtualizadoPor = 0;
  this.info_refAg = '0';
  this.idLinha = 0;
  this.info_Recibo = '';

  }

  async chamarFin(dado: Tipo): Promise<Agenda[]> {
    const api = `${environment.ApiUrl}/Agenda/AgendaByFin`;
    try {
      const response = await this.http.post<Response<Agenda[]>>(`${api}` , dado).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        console.log('Trazendo agenda:')
        console.log(response.dados)
        return response.dados;
      } else {
        throw new Error('Erro no Create do Financeiro.');
      }
    } catch (error) {
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }
}
