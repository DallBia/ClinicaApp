import { PerfilService } from './../../services/perfil/perfil.service';
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
import { HeaderService } from 'src/app/sharepage/navbar/header.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protclin',
  templateUrl: './protclin.component.html',
  styleUrls: ['./protclin.component.css']
})
export class ProtclinComponent implements OnInit, OnDestroy{

  @ViewChild(BlocoNotasComponent) blocoNotas!: BlocoNotasComponent;
  //@ViewChild(LoginComponent) login!: LoginComponent;
  texto: string = '';
  private subscription!: Subscription;
  nCliente!: number;

  //public MostraInfo: boolean = true;
  public idFoto: string = '';
  public User!:Colaborador;
  public nUser!: number;
  public UserAll!: any;



  constructor(private colaboradorService: ColaboradorService,
    public clienteService: ClienteService,
    public prontuarioService: ProntuarioService,
    public dialog: MatDialog,
    public fotoService: FileService,
    public shared: SharedService,
    public headerService: HeaderService,
    public perfilService: PerfilService,
    private router: Router,
    private userService: UserService) {



  }

  ngOnInit() {

    if(this.perfilService.validaPerfil(0,5) == false){
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

  }



 ngOnDestroy(): void {

}


  Salva()
  {

  }



  abrirModal() {

    const dialogRef = this.dialog.open(PdfModalComponent, {
        disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }
}
