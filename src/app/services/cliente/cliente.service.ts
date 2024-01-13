import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Cliente } from 'src/app/models/Clientes';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { BehaviorSubject } from 'rxjs';
import { TableData } from 'src/app/models/Tables/TableData';
import { TabResult } from 'src/app/models/Tables/TabResult';
import { FileService } from '../foto-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Tipo } from 'src/app/models/Tipo';

@Injectable({
  providedIn: 'root'
})


export class ClienteService {
  public clienteVazio: Cliente = {
  id: 0, //
  nome: '', //
  foto:  '',
  saiSozinho: false, //
  dtInclusao:  '',
  clienteDesde:  '',
  ativo: false,
  areaSession:  '',
  respFinanc:  '',
  cpf:  '',
  identidade:  '',
  dtNascim:  '',
  celular:  '',
  telFixo:  '',
  telComercial:  '',
  email:  '',
  endereco: '',
  proxses: '',

  mae:  '',
  maeRestric: false,
  maeIdentidade:  '',
  maeCpf:  '',
  maeCelular:  '',
  maeTelFixo:  '',
  maeTelComercial:  '',
  maeEmail:  '',
  maeEndereco:  '',

  pai: '',
  paiRestric: false,
  paiIdentidade: '',
  paiCpf:  '',
  paiCelular:  '',
  paiTelFixo:  '',
  paiTelComercial:  '',
  paiEmail:  '',
  paiEndereco:  '',
  }

  public tipo: string = 'tudo';
  public valor: string = 'tudo';
  public param: string = 'tudo-tudo-0-P';
  public firstID: number = 0;
  public lastID: number = 0;
  public AfirstID: number = 0;
  public AlastID: number = 0;
  public seletor: string = 'X';
    public btnA: boolean = false;
    public btnP: boolean = false;
public txtQtde: string = '';

  public cliente: Cliente = this.clienteVazio;
  public success: boolean = false;
  public clientes: Cliente[] = [];
  public clientesG: Cliente[] = [];
  public caminho: string = '';
  dataSource: TableData[] = [];
  public nLin: TableData[] = [];
  public Verifica: boolean = false;
  subscription!: Subscription;
  nChanges!: boolean;
  nVezes: number = 0;
  public fotoAtual: string='';
  public data: any;
  public Vazia: TableData[] = [{
      foto: this.fotoService.semFoto,
      Ficha: '',
      selecionada: false,
      Proxses:  '',
      id: 0,
      nome:  '',
      dtNascim:  '',
      saiSozinho:  'Sim',
      ativo : true,
      areaSession:  '',
      clienteDesde:  '',
      Idade: '',
      dtInclusao :  '',
      respFinanc :  '',
      identidade :  '',
      cpf:  '',
      endereco :  '',
      email :  '',
      telFixo: '',
      celular: '',
      telComercial: '',
      mae : '',
      maeRestric : 'Não',
      maeIdentidade : '',
      maeCpf: '',
      maeEndereco : '',
      maeEmail : '',
      maeTelFixo: '',
      maeCelular: '',
      maeTelComercial: '',
      pai : '',
      paiRestric : 'Não',
      paiIdentidade : '',
      paiCpf: '',
      paiEndereco : '',
      paiEmail : '',
      paiTelFixo: '',
      paiCelular: '',
      paiTelComercial: '',
    }];

  constructor(private http: HttpClient,
    private fotoService: FileService,
    private shared: SharedService,
    ) { }


  private apiurl = `${environment.ApiUrl}/Cliente`


  async GetClientes(): Promise<Response<Cliente[]>> {
    try {
      const response = await this.http.get<Response<Cliente[]>>(`${this.apiurl}`).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        return response;
      } else {
        throw new Error('Erro ao trazer Clientes (142): ');
      }
    } catch (error) {
      console.error('Resposta inválida da API: ', error)
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }



  CreateCliente(cliente: Cliente) : Observable<Response<Cliente[]>>{
    return this.http.post<Response<Cliente[]>>(`${this.apiurl}` , cliente);
  }

  UpdateCliente(cliente: Cliente) : Observable<Response<Cliente[]>>{
    return this.http.put<Response<Cliente[]>>(`${this.apiurl}/Editar` , cliente);
  }

  GetClienteById(id: number) : Observable<Response<Cliente>>{
    return this.http.get<Response<Cliente>>(`${this.apiurl}/id/${id}`);
  }

  GetClientesById(id: number) : Promise<any>{
    return this.http.get<any>(`${this.apiurl}/id/${id}`).toPromise();
  }

  GetClientesByAgenda(param: string): Promise<any> {
    return this.http.get<any>(`${this.apiurl}/Agenda/${param}`).toPromise();
  }

  private ClienteAtual = new BehaviorSubject<TableData>(this.Vazia[0]);
  ClienteAtual$ = this.ClienteAtual.asObservable();
  setClienteAtual(name: TableData) {
    this.ClienteAtual.next(name);
  }

  private ListaCliente = new BehaviorSubject<Cliente[]>([]);
  ListaCliente$ = this.ListaCliente.asObservable();
  setListaCliente(name: Cliente[]) {
    this.ListaCliente.next(name);
  }

  public ClienteA = new BehaviorSubject<number>(0);
  ClienteA$ = this.ClienteA.asObservable();
  setClienteA(name: number) {
    this.ClienteA.next(name);
  }

  private ChangesA = new BehaviorSubject<boolean>(false);
  ChangesA$ = this.ChangesA.asObservable();
  setChangesA(name: boolean) {
    this.ChangesA.next(name);
  }


  async BuscaClientesById(id: number){
    try{
      this.cliente = this.clienteVazio
      this.data = await this.GetClientesById(id);
      this.cliente = this.data.dados;
      return true;
    }
    catch{
      return false;
    }
  }

  // async BuscaClientes(){
  //   this.clientes = [];
  //   this.clientesG = [];
  //   const response = await this.BuscaCliente();
  //   await this.Carregar();
  //   }
  //   async BuscaCliente(){
  //     try {
  //       this.data = await this.GetClientes();
  //       this.success = this.data.sucesso;
  //       return true;
  //     } catch (error) {
  //       console.error('Erro ao buscar clientes:', error);
  //       return false;
  //     }
  //   }

  async BuscaClientes(){

  }
private mensagem: any;


  async GetClienteByFiltro(id: string): Promise<Cliente[]> {
    this.txtQtde = 'Aguarde... Carregando...'
    this.clientesG = [];
    this.clientes = [];
    this.dataSource = [];
    try {
    const resposta = await this.chamarGetCliente(id)
        this.AlastID = this.lastID;
        this.AfirstID = this.firstID;
        this.lastID = parseInt(this.mensagem[1]);
        this.firstID = parseInt(this.mensagem[0]);
        this.txtQtde = this.mensagem[3] + ' registros encontrados.'

        this.seletor = this.mensagem[2]
        console.log('lastID: ' + this.lastID);
        console.log('firstID: ' + this.firstID);
        console.log('seletor: ' + this.seletor);
        switch (this.seletor){
          case ('X'):
            this.btnA = false;
            this.btnP = false;
            break;
          case ('A'):
            this.btnA = true;
            this.btnP = true;
            break;
          case ('I'):
            this.btnA = true;
            this.btnP = false;
            break;
          case ('F'):
            this.btnA = false;
            this.btnP = true;
            break;
          default:
            this.btnA = false;
            this.btnP = false;
            break;
        }
        return this.clientesG;

    } catch (error) {
      console.log('Deu algum problema na chamargetclient')
      throw error; // Você pode personalizar essa parte conforme sua necessidade
    }
  }


  async chamarGetCliente(id: string){         //aqui eu mando um 'id' com o formato : parametro-valor-idInicial-AouP
    const url = `${environment.ApiUrl}/Cliente`;
    this.clientesG = [];
    this.mensagem = [];
    try {
      const response = await this.http.get<Response<Cliente[]>>(`${url}/novoId/${id}`).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        this.clientesG = response.dados;
        this.clientesG.sort((a, b) => a.nome.localeCompare(b.nome));
        this.mensagem = response.mensagem.split('-');    // a mensagem vem: firstY.ToString() + "-" + lastY.ToString() + "-" + seletor(I,A,X,F);
        return true
      }else{
        return false
      }
    } catch (error) {
      console.error('Erro ao buscar os clientes: ', error)
      return false
    }
  }

  async iniciar(){
    console.log(this.param)
    this.data = await this.GetClienteByFiltro(this.param);
    this.Carregar();
  }


  proximo(){
    this.param = this.tipo + '-' + this.valor + '-' + this.lastID.toString() + '-P'
    console.log(this.param)
    this.iniciar()
  }

  anterior(){
    this.param = this.tipo + '-' + this.valor + '-' + this.firstID.toString() + '-A'
    console.log(this.param)
    this.iniciar()
  }

  pLin: TableData[] = [];

  async Carregar(){
    console.log('Entrando em carregar')

    for (let i of this.clientesG) {
      let aSaiS: string = 'Não';
      let aRestM: string = 'Não';
      let aRestP: string = 'Não';

      if(i.id !== undefined){

        i.clienteDesde == null || undefined ? new Date().toISOString().split('T')[0] : i.clienteDesde = new Date(i.clienteDesde!).toISOString().split('T')[0];
        i.dtInclusao == null || undefined ? new Date().toISOString().split('T')[0] : i.dtInclusao = new Date(i.dtInclusao!).toISOString().split('T')[0];
        i.dtNascim == null || undefined ? new Date().toISOString().split('T')[0] : i.dtNascim = new Date(i.dtNascim!).toISOString().split('T')[0];


        const dtNascim = i.dtNascim !== null ? i.dtNascim.split('-') : new Date().toISOString().split('T')[0].split('-');
        i.dtNascim = dtNascim[2] + '/'+ dtNascim[1] + '/'+ dtNascim[0];
        const clienteDesde = i.clienteDesde !== null ? i.clienteDesde.split('-') : new Date().toISOString().split('T')[0].split('-');
        i.clienteDesde = clienteDesde[2] + '/'+ clienteDesde[1] + '/'+ clienteDesde[0];
        const dtInclusao = i.dtInclusao !== null ? i.dtInclusao.split('-') : new Date().toISOString().split('T')[0].split('-');
        i.dtInclusao = dtInclusao[2] + '/'+ dtInclusao[1] + '/'+ dtInclusao[0];
        i.proxses = '-'
        try{
          i.proxses == null || undefined ? new Date().toISOString().split('T')[0] : i.proxses = new Date(i.proxses!).toISOString().split('T')[0];
          const proxses = i.proxses !== null ? i.proxses.split('-') : new Date().toISOString().split('T')[0].split('-');
          i.proxses = proxses[2] + '/'+ proxses[1] + '/'+ proxses[0];
        }catch{
          i.proxses = '-'
        }



        if(i.maeRestric === true){
          aRestM = 'Sim';
        }
        if(i.paiRestric === true){
          aRestP = 'Sim';
        }
        if(i.saiSozinho === true){
          aSaiS = 'Sim';
        }
        const aId: string = i.id.toString().padStart(4, '0');
        const aIdade1 = this.converterParaDate(i.dtNascim);
        const aIdade: string = this.calcularIdade(aIdade1) + ' anos';

        this.nLin =[{
          foto: i.foto !== undefined ? i.foto : this.fotoService.semFoto,
          Ficha: aId,
          id: i.id,
          nome: i.nome,
          saiSozinho: aSaiS,
          dtNascim: i.dtNascim,
          areaSession: i.areaSession,
          telFixo: i.telFixo,
          celular: i.celular,
          selecionada: false,
          Idade:aIdade,
          clienteDesde:i.clienteDesde,
          dtInclusao: i.dtInclusao,
          respFinanc: i.respFinanc,
          endereco: i.endereco,
          email: i.email,
          identidade: i.identidade,
          ativo: i.ativo,
          cpf: i.cpf,
          telComercial: i.telComercial,
          Proxses: i.proxses,

          mae: i.mae,
          maeIdentidade:i.maeIdentidade,
          maeCpf:i.maeCpf,
          maeRestric: aRestM,
          maeCelular: i.maeCelular,
          maeTelFixo:i.maeTelFixo,
          maeTelComercial: i.maeTelComercial,
          maeEmail: i.maeEmail,
          maeEndereco: i.maeEndereco,

          pai: i.pai,
          paiIdentidade:i.paiIdentidade,
          paiCpf:i.paiCpf,
          paiRestric: aRestP,
          paiCelular: i.paiCelular,
          paiTelFixo:i.paiTelFixo,
          paiTelComercial: i.paiTelComercial,
          paiEmail: i.paiEmail,
          paiEndereco: i.paiEndereco,
        }];
        this.dataSource = [...this.dataSource, ...this.nLin]
      }
    }
    //this.shared.DataS = this.dataSource
    console.log(this.dataSource)
    let numero: number = 0;
      try{
        const cli = window.sessionStorage.getItem('nCli')
        if ( cli !== null){
          numero = parseInt(cli, 10)
        }else{
          numero = 0;
        }
      }catch{
        numero = 0;
      }

    for (let f of this.dataSource){
        try{
          const n = parseInt(f.Ficha)
          if (n == numero){
            this.setClienteA(numero);
            this.setClienteAtual(f);
          }
        }
        catch{}
    }
  }

  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  calcularIdade(dataNascimento: Date): string {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();

    // Ajuste para caso o aniversário ainda não tenha ocorrido este ano
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    return idade.toString();
  }
}
