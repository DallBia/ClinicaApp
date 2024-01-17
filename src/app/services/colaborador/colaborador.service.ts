import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { Colaborador } from 'src/app/models/Colaboradors';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { TableProf } from 'src/app/models/Tables/TableProf';
import { FormacaoService } from '../formacao/formacao.service';
import { Formacao } from 'src/app/models/Formacaos';
import { User } from 'src/app/models';
import { FileService } from '../foto-service.service';
import { Tipo } from 'src/app/models/Tipo';
import { FinanceiroService } from '../financeiro/financeiro.service';
import { FormGroup, FormsModule , FormControl, FormBuilder } from '@angular/forms';
import { PerfilService } from '../perfil/perfil.service';


interface FormField {
  id:number,
  idFuncionario: number,
  dtConclusao: any,
  nivel: string,
  registro: string,
  instituicao: string,
  nomeFormacao: string,
  areasRelacionadas:string,
  psicologia:boolean,
  fisiopadovan:boolean,
  psicopedagogia:boolean,
  terapiaocup:boolean,
  fono:boolean,
  arteterapia:boolean,
  psicomotr:boolean,
  neurofeedback:boolean,
  reforcoesc:boolean,
}


@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  constructor(private http: HttpClient, private formacaoService: FormacaoService,
              private fotoService: FileService,
              public finService:FinanceiroService,
              public perfil: PerfilService,

              ) { }

  public tipo: string = 'tudo';
  public valor: string = 'tudo'
  public param: string = 'tudo|tudo|0|P';
  public firstID: number = 0;
  public lastID: number = 0;
  public AfirstID: number = 0;
  public AlastID: number = 0;
  public seletor: string = 'X';
    public btnA: boolean = false;
    public btnP: boolean = false;
    public txtQtde: string = '';
    public nChng: boolean = false;
  public fotoAtual: string='';
  private apiurl = `${environment.ApiUrl}/User`
  public Vazia: TableProf[] = [{
    foto: '',
    ficha: '',
    id: 0,
    nome: '',
    nascimento: '',
    area: '',
    selecionada: false,
    desde: '',
    proxses: '',
    celular: '',
    telFixo: '',
    identidade :'',
    cpf : '',
    endereco : '',
    email : '',
    ativo : false,
    perfil : '',
    formacao : undefined
  }]

  pLin: TableProf[] = [];
  dataSource: TableProf[] = [];

  nProf = 1;
  CAtual!: Colaborador[]; // guarda o usuário atual
  public tableV: TableProf = {
    foto: '',
    ficha: '',
    id: 0,
    nome: '',
    nascimento: '',
    area: '',
    selecionada: false,
    desde: '',
    proxses: '',
    celular: '',
    telFixo: '',
    identidade :'',
    cpf : '',
    endereco : '',
    email : '',
    ativo : false,
    perfil : '',
    formacao : undefined
  }

  public formFields: FormField[] = [];
  public formField!: FormField

  public eAtual: TableProf = this.tableV

  nEquipe: number = 0;
  nFormacao: number = 0;
  nUsr:number = 0;

  nChanges: boolean = false;
  nChangesL: boolean = false;
  Selecionada: string = '';
  ListaEquipe: any;
  ListaFormacaos: any;
  public colaboradors: Colaborador[]=[]
  public V: Colaborador[]=[]
  public colaboradorsG: Colaborador[] = [];
  public ColAt!: Colaborador;
  public vSalvarCadProf: boolean = false;
  public vNovoCadProf: boolean = false;
  public vPerfilCadProf: boolean = false;
  public equipeVazia: Colaborador = {
    id: 0,
    nome: '',
    dtNasc: '',
    rg: '',
    cpf: '',
    endereco: '',
    telFixo: '',
    celular: '',
    email: '',
    dtAdmis: '',
    dtDeslig: '',
    idPerfil:  0,
    ativo: true,
    areaSession: '',
    senhaHash: '',
    foto: '',
  }


  public ProfN: number = 0;
  public success: boolean = false;






  validarPermissoes(){
    const idSel = window.localStorage.getItem('nCol');
    const idUsr = window.localStorage.getItem('nUsr');
    this.vNovoCadProf = this.perfil.validaPerfil(2,3);
    this.vSalvarCadProf = this.perfil.validaPerfil(2,4);
    this.vPerfilCadProf = this.perfil.validaPerfil(2,15);

    console.log('Pode criar novo? ' + this.vNovoCadProf)
    console.log('Pode Salvar? ' + this.vSalvarCadProf)
    console.log('Pode Alterar Perfil? ' + this.vPerfilCadProf)

  }





    GetColaboradorbyEmail(Login: string, senha: string): Observable<Response<Colaborador[]>> {
      const body = { Login: Login, Senha: senha };
      const apiurllogin = `${environment.ApiUrl}/User/Email`;
      return this.http.post<Response<Colaborador[]>>(apiurllogin, body);
    }
    GetColaborador(): Promise<any> {
      const apiurllogin = `${environment.ApiUrl}/User`;
      return this.http.get<any>(apiurllogin).toPromise();
    }


    CreateColaborador(prof: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador`;
      return this.http.post<Response<Colaborador[]>>(apiurllogin, prof);
    }

    UpdateColaborador(prof: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador/Editar`;
      return this.http.put<Response<Colaborador[]>>(apiurllogin, prof);
    }




    GetColaboradorbyId(id: number) : Promise<any>{
        return this.http.get<any>(`${environment.ApiUrl}/Colaborador/id/${id}`).toPromise();
    }

    async GetColabByTipo(tipo: string): Promise<Tipo[]> {
      let resp: Tipo[] = [];
      const response = await this.http.get<Response<Tipo[]>>(`${environment.ApiUrl}/Colaborador/Agenda/${tipo}`).toPromise();
      if (response && response.dados !== undefined && response.sucesso) {
        resp = response.dados
      }
      return resp;
    }

    async GetEquipeMinimal() : Promise<Tipo[]>{
     try {
        const response = await this.http.get<Response<Tipo[]>>(`${environment.ApiUrl}/Colaborador/Agenda`).toPromise();

        if (response && response.dados !== undefined && response.sucesso) {
          this.setProfAtual
          response.dados;

          return response.dados;
        } else {
          throw new Error('Erro no Colaborador Service');
        }
      } catch (error) {
        throw error; // Você pode personalizar essa parte conforme sua necessidade
      }
    }

    async GetCol(){
    this.colaboradors = [];
    this.colaboradorsG = [];
      try {
        const data = await this.GetColaborador();

        const dados = data.dados;
              dados.map((item:{
                dtAdmis: any;
                dtDeslig: any;
                dtNasc: any
              }) => {

            item.dtAdmis !== null ? item.dtAdmis = new Date(item.dtAdmis!).toISOString().split('T')[0] : '---'
            item.dtDeslig !== null ? item.dtDeslig = new Date(item.dtDeslig!).toISOString().split('T')[0] : '---'
            item.dtNasc !== null ? item.dtNasc = new Date(item.dtNasc!).toISOString().split('T')[0] : '---'

            const dtAdmis = item.dtAdmis !== null ? item.dtAdmis.split('-') : '*-*-*';
            item.dtAdmis = dtAdmis[2] + '/'+ dtAdmis[1] + '/'+ dtAdmis[0];
            const dtDeslig = item.dtDeslig !== null ? item.dtDeslig.split('-') : '*-*-*';
            item.dtDeslig = dtDeslig[2] + '/'+ dtDeslig[1] + '/'+ dtDeslig[0];
            const dtNasc = item.dtNasc !== null ? item.dtNasc.split('-') : '*-*-*';
            item.dtNasc = dtNasc[2] + '/'+ dtNasc[1] + '/'+ dtNasc[0];
          });

        this.colaboradorsG = data.dados;
        this.colaboradorsG.sort((a, b) => a.nome.localeCompare(b.nome));
        this.colaboradors = this.colaboradorsG;
        this.setEquipeAtual(data.dados);
        this.success = data.sucesso;
        // this.success = await this.Dados1();

        const r = await this.Carregar();

        return true;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return false;
      }
    }



    AlteraSenha(userName: string, password: string)  : Observable<Response<string>>{

      const body = {
        Usuario: userName,
        Senha: password
      };
      const apiurl = `${environment.ApiUrl}/Colaborador/AltSen`;
      return this.http.post<Response<string>>(apiurl, body);

    }



    UpdateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador/Editar`;
      return this.http.put<Response<Colaborador[]>>(apiurllogin, Equipe);
    }




    private EquipeAtual = new BehaviorSubject<Colaborador>(this.V[0]);
    EquipeAtual$ = this.EquipeAtual.asObservable();
    setEquipeAtual(name: Colaborador) {
      this.EquipeAtual.next(name);
      this.ColAt = name;
    }

    private EquipeA = new BehaviorSubject<number>(0);
    EquipeA$ = this.EquipeA.asObservable();
    setEquipeA(name: number) {
      this.EquipeA.next(name);
    }

    getEquipeId(id: number){
      let resp = null;
      for(let i of this.colaboradorsG){
        if (i.id == id){
          resp = i;
        }
      }
      if (resp == null){
        for(let i of this.colaboradorsG){
          if (i.id == this.EquipeA.getValue()){
            resp = i;
          }
        }
      }
      return resp;
    }

    private ProfAtual = new BehaviorSubject<TableProf>(this.Vazia[0]);
    ProfAtual$ = this.ProfAtual.asObservable();

    setProfAtual(name: TableProf) {
      const currentProf = this.ProfAtual.getValue();
      currentProf.foto = name.foto;
      this.fotoAtual = name.foto;
      currentProf.ficha = name.ficha;
      currentProf.id = name.id;
      currentProf.nome = name.nome;
      currentProf.nascimento = name.nascimento;
      currentProf.area = name.area;
      currentProf.selecionada = name.selecionada;
      currentProf.desde = name.desde;
      currentProf.proxses = name.proxses;
      currentProf.celular = name.celular;
      currentProf.telFixo = name.telFixo;
      currentProf.identidade = name.identidade;
      currentProf.cpf = name.cpf;
      currentProf.endereco = name.endereco;
      currentProf.email = name.email;
      currentProf.ativo = name.ativo;
      currentProf.perfil = name.perfil;
      currentProf.formacao = name.formacao;

      this.ProfAtual.next(currentProf);
    }





    private ProfA = new BehaviorSubject<number>(0);
    ProfA$ = this.ProfA.asObservable();
    setProfA(name: number) {
      this.ProfA.next(name);
    }

    private ChangesA = new BehaviorSubject<boolean>(false);
    ChangesA$ = this.ChangesA.asObservable();
    setChangesA(name: boolean) {
      this.ChangesA.next(name);
    }
    private ChangesL = new BehaviorSubject<boolean>(false);
    ChangesL$ = this.ChangesL.asObservable();
    setChangesL(name: boolean) {
      this.ChangesL.next(name);
    }





proximo(){
  this.param = this.tipo + '|' + this.valor + '|' + this.lastID.toString() + '|P'
  console.log(this.param)
  this.iniciar()
}

anterior(){
  this.param = this.tipo + '|' + this.valor + '|' + this.firstID.toString() + '|A'
  console.log(this.param)
  this.iniciar()
}


    async GetColbyFiltro(id: string): Promise<Colaborador[]> {
      this.txtQtde = 'Aguarde... Carregando...'
      this.colaboradorsG = [];
      this.colaboradors = [];
      this.dataSource = [];
      const url = `${environment.ApiUrl}/Colaborador`;
      try {
        const data = await this.http.get<Response<Colaborador[]>>(`${url}/novoId/${id}`).toPromise();

        if (data && data.dados !== undefined && data.sucesso) {

          const dados = data.dados;
          dados.map((item:{
            dtAdmis?: any;
            dtDeslig?: any;
            dtNasc?: any
          }) => {

        item.dtAdmis !== null ? item.dtAdmis = new Date(item.dtAdmis!).toISOString().split('T')[0] : '---'
        item.dtDeslig !== null ? item.dtDeslig = new Date(item.dtDeslig!).toISOString().split('T')[0] : '---'
        item.dtNasc !== null ? item.dtNasc = new Date(item.dtNasc!).toISOString().split('T')[0] : '---'

        const dtAdmis = item.dtAdmis !== null ? item.dtAdmis.split('-') : '*-*-*';
        item.dtAdmis = dtAdmis[2] + '/'+ dtAdmis[1] + '/'+ dtAdmis[0];
        const dtDeslig = item.dtDeslig !== null ? item.dtDeslig.split('-') : '*-*-*';
        item.dtDeslig = dtDeslig[2] + '/'+ dtDeslig[1] + '/'+ dtDeslig[0];
        const dtNasc = item.dtNasc !== null ? item.dtNasc.split('-') : '*-*-*';
        item.dtNasc = dtNasc[2] + '/'+ dtNasc[1] + '/'+ dtNasc[0];
      });


          this.colaboradorsG = data.dados;
          this.colaboradorsG.sort((a, b) => a.nome.localeCompare(b.nome));
          this.colaboradors = this.colaboradorsG;
          const mensagem = data.mensagem.split('|');
          this.AlastID = parseInt(mensagem[1]);
          this.AfirstID = parseInt(mensagem[0]);
          this.lastID = parseInt(mensagem[1]);
          this.firstID = parseInt(mensagem[0]);
          this.txtQtde = mensagem[3] + ' registros encontrados.'
          this.seletor = mensagem[2]
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
          return data.dados;
        } else {
          throw new Error('GetColbyFiltro não retornou uma resposta válida.');
        }
      } catch (error) {
        throw error; // Você pode personalizar essa parte conforme sua necessidade
      }
    }


    async iniciar(){
      console.log(this.param)
      const data = await this.GetColbyFiltro(this.param);
      //const dataFormacao = await this.formacaoService.getFormacao();
      this.Carregar();
    }

    Carregar(){

      this.dataSource = [];
      for (let i of this.colaboradorsG){
        let tipo = '';
        switch (i.idPerfil) {
          case 0:
            tipo = 'Diretoria';
            break;
          case 1:
            tipo = 'Secretaria';
            break;
          case 2:
            tipo = 'Coordenação'
            break;
          default:
            tipo = 'Equipe Clínica'
            break;
        }

        this.pLin = [{
          foto: i.foto !== undefined ? i.foto : this.fotoService.semFoto,
          ficha: i.id !== undefined ? i.id.toString().padStart(4, '0') : '0',
          id: i.id,
          nome: i.nome,
          nascimento: i.dtNasc,
          area: i.areaSession !== undefined ? i.areaSession : '-',
          selecionada: false,
          desde: i.dtAdmis,
          proxses: '',
          celular: i.celular,
          telFixo: i.telFixo,
          identidade: i.rg,
          cpf : i.cpf,
          endereco : i.endereco,
          email : i.email,
          ativo : i.ativo,
          perfil : tipo,
        }]
        this.dataSource = [...this.dataSource, ... this.pLin]
      }
    }


    GetEquipe() : Observable<Response<Colaborador[]>>{
      return this.http.get<Response<Colaborador[]>>(this.apiurl);
    }
    CreateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurl = `${environment.ApiUrl}/Colaborador`;
      return this.http.post<Response<Colaborador[]>>(apiurl , Equipe);
    }
}
