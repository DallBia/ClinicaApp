import { LoginComponent } from './../login/login.component';
import { ColaboradorService } from './../../services/colaborador/colaborador.service';
import { UserService } from './../../services/user.service';
import { TableData } from 'src/app/models/Tables/TableData';
import { ClienteService } from './../../services/cliente/cliente.service';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProntuarioService } from 'src/app/services/prontuario/prontuario.service';
import { BlocoNotasComponent } from 'src/app/sharepage/bloco-notas/bloco-notas.component';
import { Prontuario } from 'src/app/models/Prontuarios';
import { Colaborador } from 'src/app/models/Colaboradors';
import { FileService } from 'src/app/services/foto-service.service';
import { jsPDF } from "jspdf";
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { PdfModalComponent } from 'src/app/sharepage/form-pront/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-protclin',
  templateUrl: './protclin.component.html',
  styleUrls: ['./protclin.component.css']
})
export class ProtclinComponent implements OnInit, OnDestroy{

  @ViewChild(BlocoNotasComponent) blocoNotas!: BlocoNotasComponent;
  @ViewChild(LoginComponent) login!: LoginComponent;
  texto: string = '';
  private subscription!: Subscription;
  nCliente!: number;
  Atual!: TableData;
  public Ficha:string = 'FICHA';
  public NomeCliente: string = '';
  //public MostraInfo: boolean = true;
  public idFoto: string = '';
  public User!:Colaborador;
  public nUser!: number;
  public UserAll!: any;



  constructor(private colaboradorService: ColaboradorService,
    public clienteService: ClienteService,
    private prontuarioService: ProntuarioService,
    public dialog: MatDialog,
    public fotoService: FileService,
    public shared: SharedService,
    private userService: UserService) {
    this.subscription = this.clienteService.ClienteA$.subscribe(
      nameC => this.nCliente = nameC
    )
    this.subscription = this.userService.EquipeA$.subscribe(
      nameC => this.nUser = nameC
    )

    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.Atual = clienteAtual;
    });
  }

  ngOnInit() {

    this.shared.MostraInfo = true;
    console.log(this.shared.MostraInfo);
    this.subscription = this.clienteService.ClienteA$.subscribe(
      nameC => this.nCliente = nameC
    )
    this.subscription = this.userService.EquipeA$.subscribe(
      nameC => this.nUser = nameC
    )

    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.Atual = clienteAtual;
    });

    this.UserAll = this.colaboradorService.GetColaborador();
// this.delay(300);

    if(this.nCliente !== 0){
        this.Ficha = this.Atual.Ficha;
      this.NomeCliente = this.Atual.nome.toUpperCase();
      this.idFoto = '../../../assets/img/Clientes/' + this.Ficha + '.jpg'

      }else{
      this.Ficha = 'FICHA';
      this.NomeCliente = '';
    }
    this.newInfo(this.shared.MostraInfo);
  }

  newInfo(opt: boolean){
    this.shared.MostraInfo = !opt;
    this.shared.texto = '';
  }

  adicionarEspaco() {

  }


  ficha = [
    { texto: this.Ficha, altura: '10vh', largura: '18vh', cor: 'var(--cor-clara)', size: '20pt' }
  ];
  containers = [
    {altura:'10vh', largura: "200vh"}
  ];
  botoes = [
    { texto: '', altura: '4.6vh', largura: '15vh', cor: 'white' },
    { texto: '', altura: '4.6vh', largura: '15vh', cor: 'white' },
    { texto: '', altura: '4.6vh', largura: '15vh', cor: 'white'},
    { texto: '', altura: '4.6vh', largura: '15vh', cor:'white' }
  ];
  botoesInfo = [
    { texto: 'Anexar Documento', altura: '4vh', largura: '30vh', cor: 'white' },
    { texto: 'Ver Documento', altura: '4vh', largura: '30vh', cor: 'white' },
    { texto: 'Imprimir Relatório', altura: '4vh', largura: '30vh', cor: 'white' },
    { texto: 'Buscar neste Prontuário', altura: '4vh', largura: '30vh', cor: 'white' },
    { texto: 'Inserir nova informação', altura: '4vh', largura: '30vh', cor: 'white' },
 ]
 ngOnDestroy(): void {
  this.subscription.unsubscribe();
}


  Salva()
  {
    const r = this.clienteService.BuscaAgenda();

  }



  abrirModal() {

    const dialogRef = this.dialog.open(PdfModalComponent, {
        disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }
}
