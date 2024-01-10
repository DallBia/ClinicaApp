import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../models/Clientes';
import { Info } from '../models/Infos';
import { Colaborador } from '../models/Colaboradors';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Response } from '../models/Response';
import { environment } from 'src/environments/environment';
import { TableProntClin } from '../models/Tables/TableProntClin';
import {Tipo} from '../models/Tipo';
import { Valor } from '../models/Valores';
import { TableData } from '../models/Tables/TableData';
import { Documento } from '../models/Documentos';
import { HeaderService } from '../sharepage/navbar/header.service';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private selectedNameSubject = new BehaviorSubject<string>('');
  selectedName$ = this.selectedNameSubject.asObservable();
  setSelectedName(name: string) {
    this.selectedNameSubject.next(name);
  }
  private selectedFichaSubject = new BehaviorSubject<string>('NOVO');
  selectedFicha$ = this.selectedFichaSubject.asObservable();
  setSelectedFicha(name: string) {
    this.selectedFichaSubject.next(name);
  }
  private selectedNascimentoSubject = new BehaviorSubject<string>('');
  selectedNascimento$ = this.selectedNascimentoSubject.asObservable();
    setSelectedNascimento(name: string) {
    this.selectedNascimentoSubject.next(name);
  }
  private protadmChange = new BehaviorSubject<boolean>(false);
  protadmChange$ = this.protadmChange.asObservable();
    setprotadmChange(name: boolean) {
    this.protadmChange.next(name);
  }
  private protcliChange = new BehaviorSubject<boolean>(false);
  protcliChange$ = this.protcliChange.asObservable();
    setprotcliChange(name: boolean) {
    this.protcliChange.next(name);
  }



public data: string = "01/01/2000";
  private selectedImageSource = new BehaviorSubject<string | null>(null);

  selectedImage$ = this.selectedImageSource.asObservable();

  setSelectedImage(imageUrl: string): void {
    this.selectedImageSource.next(imageUrl);
  }


public ListaNomesC: Tipo[] = [];
public ClienteAtual: number = 0;
public ProfAtual: number = 0;
public ListaClientes!: Cliente;
public ListaProfs!: Colaborador;
public pagina = '';
public MostraInfo = false;
public texto: string = '';
public xvalor: number | string = 0;
public idTexto: number = 0;
public valid: boolean=false;
public validFiltro = false;
public ListaValores: Valor[] = []
public DataS: TableData[]=[]
public btnAnexCli: boolean = false;
public btnAnexPro: boolean = false;
public ListaArquivos: Documento[] = [];
public PessoaDoctos = '';
public nome: string = '';
public docto: Documento = {
  id: 0,
  idPessoa: 0,
  cliOuProf:'C',
  tipo:'',
  nome: '',
  descricao:'',
  dtInclusao:new Date().toISOString(),
  arquivo:'',
  formato:'',
}


//--- variável para ajudar no modal de confirmação:

public nbotoes: string[] = [];
public tituloModal: string = '';
public textoModal: string = '';
public ListaPront: TableProntClin[] = []; //modal do Prontuário
public respostaModal: string ='';






//=============================================


  private selectedRowSource = new BehaviorSubject<any>(null);
    currentSelectedRow = this.selectedRowSource.asObservable();


  changeSelectedRow(row: any) {
        this.selectedRowSource.next(row);
    }


    constructor(private http: HttpClient,
                private header: HeaderService,
                  ) {

    }

 private apiurl = `${environment.ApiUrl}`
private ApiValor = `${environment.ApiUrl}/Valor`


  UpdateInfo(info: Info) : Observable<Response<Info>>{
    return this.http.put<Response<Info>>(`${this.apiurl}/Info/Editar` , info);
  }
  GetInfoById(id: number): Observable<Response<Info>> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Response<Info>>(`${this.apiurl}/Info/id`, { params });
  }

  GetValores(): Promise<any> {
    return this.http.get<any>(`${this.apiurl}/Valor`).toPromise();
  }

  createValor(novo: Valor): Observable<Response<Valor[]>>{
    return this.http.post<Response<Valor[]>>(`${this.apiurl}/Valor` , novo);
  }
  updateValor(valor: Valor): Observable<Response<Valor[]>>{
    let url = `${this.ApiValor}/Editar`;
    console.log(url)
    return this.http.put<Response<Valor[]>>( url , valor);
  }


  GetClientesByAgenda(tipo: string): Promise<any> {
    return this.http.get<any>(`${environment.ApiUrl}/Cliente/Agenda`).toPromise();
  }





  async BuscaValores(){
    let valor: any;
    let linhaValor: Valor
    try{
      const Valores = await this.GetValores();
      valor = Valores.dados;
      valor.map((item: { valor: number | null; data: string | null; id: number | null; nome: string | null; }) => {

         });
      this.ListaValores = valor
    }
    catch{

    }
    console.log(valor)
    return valor;
  }
  delay(time:number) {
    setTimeout(() => {

    }, time);
  }

  apiDocto = `${environment.ApiUrl}/Documento`
  createArquivo(novo: Documento): Observable<Response<Documento[]>>{
    return this.http.post<Response<Documento[]>>(`${this.apiDocto}` , novo);
  }


      uploadFile(file: File, name: string): Promise<Response<Tipo[]>> {
        return new Promise((resolve, reject) => {
            const formData: FormData = new FormData();
            name = name + '%' + file.name
            formData.append('file', file, name);
            const url = `${environment.ApiUrl}/Image`;

            this.http.post<Response<Tipo[]>>(url, formData).subscribe(
                (response) => {

                    resolve(response);
                },
                (error) => {
                    reject(error);
                }
            );
        });
      }

      listarArquivos(id: number,tipo: string): Promise<Tipo[]> {
        return new Promise((resolve, reject) => {
          let url = `${environment.ApiUrl}/Image/id/${id}`;
            if (tipo == 'E'){
              url = `${environment.ApiUrl}/Image/id2/${id}`;
            }

            this.http.get<Response<Tipo[]>>(url).subscribe(
                (response) => {
                    resolve(response.dados);
                },
                (error) => {
                    reject(error);
                }
            );
        });
      }

      async carregarListaDeArquivos(){
        let data: Tipo[] = [];
        let PessoaAtual = 0;
        if (this.PessoaDoctos == "C"){
          data = await this.listarArquivos(this.ClienteAtual,'C');
          PessoaAtual = this.ClienteAtual
        }else{
          data = await this.listarArquivos(this.ProfAtual,'E');
          PessoaAtual = this.ProfAtual
        }

        this.ListaArquivos = [];
        let tipoPessoa = 'C';

        if (this.header.linkAtivo == 'CADASTRO DA EQUIPE'){
          tipoPessoa = 'E';

        }

        for (let i of data){
          const info = i.nome.split('%');
          const id = parseInt(info[0]);
          let tipoarquivo = '';
          switch (info[4]){
            case ('pdf'):
              tipoarquivo = 'description';
            break;
            case ('Word'):
              tipoarquivo = 'edit_document';
            break;
            case('Excel'):
              tipoarquivo = 'rubric';
            break;
            case('Imagem'):
              tipoarquivo = 'photo';
            break;
            default:
              tipoarquivo = 'question_exchange';
            break;
          }
          let dia = info[7].substring(0,10)

          if(id == PessoaAtual && info[1] == tipoPessoa){
            const lin: Documento[] = [{
              id: i.id,
              idPessoa: 0,
              cliOuProf: tipoPessoa,
              tipo: tipoarquivo,
              nome: info[3],
              descricao: info[2],
              dtInclusao: dia,
              arquivo: info[5],
              formato: tipoarquivo
            }]
            this.ListaArquivos = [...this.ListaArquivos, ...lin]
          }
        }
      }

      async downloadDeArquivos(id: number, nomeArquivo: string){
        const data = await this.baixarArquivo(id);
        console.log(data)
        const nome = nomeArquivo //this.extrairNomeDoArquivoDoBlob(data);
        console.log(nome)
        // const urlBlob = URL.createObjectURL(data);

        //   // Cria um link e simula um clique para iniciar o download
        //   const link = document.createElement('a');
        //   link.href = urlBlob;
        //   link.download = `nome_do_arquivo_${id}.extensao`; // Substitua pela extensão real
        //   link.click();
        saveAs(data, nome);

      }
      baixarArquivo(id: number): any {
        return new Promise((resolve, reject) => {
          const url = `${environment.ApiUrl}/Image/download/${id}`;
            this.http.get(url, { responseType: 'blob' }).subscribe(
          (response: Blob) => {
            resolve(response);
          },
          (error) => {
            console.error('Erro ao baixar arquivo:', error);
          }
        );
      });
      }

      extrairNomeDoArquivoDoBlob(blob: Blob): string {
        // Obtém o cabeçalho 'content-disposition' da resposta
        const contentDispositionHeader = blob.type;

        // Verifica se o cabeçalho está presente
        if (contentDispositionHeader) {
          // Procura por uma correspondência com o padrão do cabeçalho 'content-disposition'
          const match = contentDispositionHeader.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);

          // Se houver uma correspondência, extrai e retorna o nome do arquivo
          if (match && match[1]) {
            return match[1].replace(/['"]/g, '');
          }
        }

        // Se o cabeçalho 'content-disposition' não estiver presente ou não houver uma correspondência, retorna nulo
        return 'sem nome.pdf';
      }


  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  reDatas(dataO: string){

    const [dia, mes, ano] = dataO.split('/');
    if(dia.length == 2){
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
      const dataFormatada = data.toISOString();
       return (dataFormatada);
    }
    else{
       return (dataO);
    }

  }
}
