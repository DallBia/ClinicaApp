import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { Colaborador } from "src/app/models/Colaboradors";
import { TableData } from "src/app/models/Tables/TableData";
import { UserService } from "src/app/services";
import { ClienteService } from "src/app/services/cliente/cliente.service";
import { ColaboradorService } from "src/app/services/colaborador/colaborador.service";
import { ProntuarioService } from "src/app/services/prontuario/prontuario.service";
import { BlocoNotasComponent } from "src/app/sharepage/bloco-notas/bloco-notas.component";
import { LoginComponent } from "../login/login.component";
import { FileService } from "src/app/services/foto-service.service";
import { SharedService } from "src/app/shared/shared.service";
import { MatDialog } from '@angular/material/dialog';
import { PdfModalComponent } from 'src/app/sharepage/form-pront/pdf-modal/pdf-modal.component';
import { PerfilService } from "src/app/services/perfil/perfil.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-protadm',
  templateUrl: './protadm.component.html',
  styleUrls: ['./protadm.component.css']
})


export class ProtadmComponent implements OnInit, OnDestroy{


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
    public prontuarioService: ProntuarioService,
    public shared: SharedService,
    public fotoService: FileService,
    private perfilService: PerfilService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService) {


  }

  ngOnInit() {

    if(this.perfilService.validaPerfil(0,7) == false){
      alert('Você não tem autorização para acessar esta página')
      this.router.navigate(['/inicio']);
    }

    this.shared.ListaPront = [];
    this.inicio()
  }
  async inicio(){
    this.shared.MostraInfo = false;
      this.prontuarioService.iniciar();
  }

  newInfo(opt: boolean){
    this.shared.MostraInfo = !opt;
    this.shared.texto = '';
  }

  adicionarEspaco() {
    //this.texto += '\n\n';
  }
 ngOnDestroy(): void {

    }
    abrirModal() {

      const dialogRef = this.dialog.open(PdfModalComponent, {
          disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
      });
      dialogRef.afterClosed().subscribe((result: any) => {

      });
    }
}


