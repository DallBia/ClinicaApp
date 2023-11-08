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

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  constructor(private http: HttpClient, private formacaoService: FormacaoService) { }

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
  EAtual!: Colaborador[]; // guarda o usuário atual
  nEquipe: number = 0;
  FAtual: any; //guarda a lista de Formações do usuário.
  nFormacao: number = 0;
  nUsr:number = 0;

  nChanges: boolean = false;
  nChangesL: boolean = false;
  Selecionada: string = '';
  ListaEquipe: any;
  ListaFormacaos: any;
  private control!:any;
  private ctrl1: boolean = false;
  private ctrl2: boolean = false;
  public colaboradors: Colaborador[]=[]
  public V: Colaborador[]=[]
  public colaboradorsG: Colaborador[] = [];
  private colaboradors$!: Observable<Colaborador[]>;

  public ProfN: number = 0;

    GetColaboradorbyEmail(Login: string, senha: string): Observable<Response<Colaborador[]>> {
      const body = { Login: Login, Senha: senha };
      const apiurllogin = `${environment.ApiUrl}/User/Email`;
      return this.http.post<Response<Colaborador[]>>(apiurllogin, body);
    }

    GetCol(): Observable<Colaborador[]> {
      return this.GetColaborador().pipe(
        map((data) => {
          const dados = data.dados;
          dados.map((item) => {

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
          this.colaboradors = data.dados;
          this.colaboradorsG.sort((a, b) => a.nome.localeCompare(b.nome));
          return this.colaboradorsG; // Retorna o array
        }),
        switchMap((colaboradores) => of(colaboradores)) // Converte o array em um observable
      );
    }



    GetColaborador(): Observable<Response<Colaborador[]>> {
      const apiurllogin = `${environment.ApiUrl}/User`;
      return this.http.get<Response<Colaborador[]>>(apiurllogin);
    }



    CreateColaborador(prof: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador`;
      return this.http.post<Response<Colaborador[]>>(apiurllogin, prof);
    }

    UpdateColaborador(prof: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador/Editar`;
      return this.http.put<Response<Colaborador[]>>(apiurllogin, prof);
    }





    GetEquipe() : Observable<Response<Colaborador[]>>{
      return this.http.get<Response<Colaborador[]>>(this.apiurl);
    }
    CreateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurl = `${environment.ApiUrl}/Colaborador`;
      return this.http.post<Response<Colaborador[]>>(apiurl , Equipe);
    }

    AlteraSenha(userName: string, password: string)  : Observable<Response<string>>{

      const body = {
        Usuario: userName,
        Senha: password
      };
      const apiurl = `${environment.ApiUrl}/Colaborador/AltSen`;
      console.log(apiurl)
      return this.http.post<Response<string>>(apiurl, body);

      }



    UpdateEquipe(Equipe: Colaborador) : Observable<Response<Colaborador[]>>{
      const apiurllogin = `${environment.ApiUrl}/Colaborador/Editar`;
      return this.http.put<Response<Colaborador[]>>(apiurllogin, Equipe);
    }



    // EnviarEmail(dado: any) : Observable<Response<string>>{

    //   const apiurllogin = `${environment.ApiUrl}/Email`;
    //   return this.http.put<Response<string>>(apiurllogin, dado);
    // }

    private EquipeAtual = new BehaviorSubject<Colaborador>(this.V[0]);
    EquipeAtual$ = this.EquipeAtual.asObservable();
    setEquipeAtual(name: Colaborador) {
      this.EquipeAtual.next(name);
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


inicio(){
    this.GetCol().subscribe((data) => {
      this.control = data;
      this.ctrl1 = this.Dados2();
     });

       this.formacaoService.GetFormacao().subscribe(data => {
         this.formacaoService.formacaos = data.dados;
         this.ctrl2 = this.Dados1();
     });
     this.Dados3();
}
    Dados1(): boolean {
      if (!this.formacaoService.formacaos) {
        setTimeout(() => {
          this.Dados1();
        }, 300);
      } else {
        return true;
      }
      return true;
    }


    Dados2(): boolean {
      if (!this.control) {
        setTimeout(() => {
          this.Dados2();
        }, 300);
      } else {
        return true;
      }
      return true;
    }


    Dados3() {
      if (this.ctrl1 === true && this.ctrl2 === true) {
        this.Carregar();
      } else {
        setTimeout(() => {
          this.Dados3();
        }, 300);
      }
    }



public semFoto: string = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAlgCWAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAFsAV4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD77ooor1TiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo2n0oxQAUUYPbmjB9KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiq2pala6PZSXd5MsECDlmPX2Hqa8R8afFq/15pLXTGax0/pvU4kf3z2HtXTRoTrP3djKdSNPc9S8RfETQ/DOUnuhNcDpDD82fxHArzzVvjpfz5Gm2EdqvrcfOf0rzHqxYnLMclj1NFezTwdKG+rOGVecttDp734l+JL4ndqUkAPaAlRWe3i7XXOTrF4f+2lZFFdSpwW0UY80u5sw+NNfgOU1m8/7+VrWHxY8S2DD/AEtbkA9LgFq5Cih0qct4oFKS2Z69o3x2jZlTVbAqD1mhICj8Otei6H4m0vxHCJNPvEm/2D8rfkea+XKls7qfT7hbi1me2nXpJGcGuKpgacvg0ZvHESjvqfWNFeV+B/jEt08dhru2OU/Kl2owp9iP616mrBlDKQysMhlOQR6141SlOi7SR3Qmpq6FooorE0CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKr6hqFvpNjNd3Ugit4l3MxqwBngV4d8YPGZ1jUv7ItJc2Nsf3pXpI/+FdFCi60+XoZVJ+zjc5/xx44uvGmoMzEx6fGf3Nv2+p9TXNUUV9NGKguWOx5Tbk7sKKKKoQUUUUAFFFFABRRRQAEBuDXp/wALfiQ1jNHo+qylrZ+IJmPKH0J9K8woP5HqD6VlUpxqx5ZFxk4O6PraiuA+EvjQ+INKOnXTbr60AAYn76dvqa7+vmalN05OMj1YyUldBRRRWRYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAc74+8R/8Iv4YurpWxcSDyof989DXzYWZ2Z2OWYliT6mvSPjhrhu9ct9LRvktUzIv+0eQfyrzavosHT5Kd+rPMry5p27BRRRXcc4UUUUAFFFFABRRRQAUUUUAFFFFAGr4X12Xw3r1pfxNtCNtk9Ch+9+lfTtvcR3ltDcQndFMgkQ+xGRXyawDAg9DXvfwb146v4WNtI26eybY3+6fu/oK8rH07xVRdDrw8rPlO7ooorxD0AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoDKnzOcIvJPtRWV4svDYeGNVnBwyW7lfriqiuZpCbsrnzf4k1J9X8Qahducl5mUfQEgVnUisXy56sdx/Glr61Kysjxb31CiiimAUUUUAFFFFABRRRQAUUUUAFFFFABXofwQ1T7J4onsScJdxFz9VHH8688ra8FXx0/xdpUoON06xn6Eisa0eenKJcJcskz6copXxuOOmaSvlT2AooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArj/AIsXRtfA92Qf9Y6x/nmuwrzz44TeX4Pij/v3KH8s10YdXqxXmZVNIM8LUbVA9qWiivqDyQooooAKKKKACiiigAooooAKKKKACiiigAqaxm+z39rN/wA85Vf8jUNNkbahb05o30A+s7N/Ns7aTrviVvzGalqhoEnnaDpzHr9nj/8AQRV+vkZaNo9pbBRRRUjCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8z+O3/IAsxn/lsP516ZXmnx1U/wDCO2j46TKP1rrwv8aJjW/hs8Uooor6U8oKKKKACiiigAooooAKKKKACiiigAooooAKZN/qX+hp9Mm/1L/Q0wPqHwe2/wAL6Yf+mK/yFbFZHhKPy/DOmL/0wU/oK16+Rn8TPZjsgoooqCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuF+M9obrwSzDrHOjfhzXdVjeMtP/tTwrqdvjLGBin+8BxW1GXLUi/MzmrxaPmKikVSo2t95flP1FLX1R5AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUqxmZ0jHVyF/OkrX8I6a2reKNMt1GR5yuw/2QeaUnypsaV3Y+lNIh+z6RYx9NsCD/wAdFW6NoT5V+6vAor5Fu7ueyFFFFIYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA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'
    Carregar(){
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
        let pForm: Formacao[] = [];
        for (const forma of this.formacaoService.formacaos) {
          let x = forma.idFuncionario;
          if (forma.idFuncionario == i.id) {
            pForm.push(forma);
          }
        }
        this.pLin = [{
          foto: i.foto !== undefined ? i.foto : this.semFoto,
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
          formacao :pForm,
        }]
        this.dataSource = [...this.dataSource, ... this.pLin]
      }
    }

}
