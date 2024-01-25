import { Component, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Documento } from 'src/app/models/Documentos';
import { SharedService } from 'src/app/shared/shared.service';
import { HeaderService } from '../navbar/header.service';
import { Tipo } from 'src/app/models/Tipo';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ModalConfirComponent } from 'src/app/sharepage/modal-confir/modal-confir.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-arquivos',
  templateUrl: './arquivos.component.html',
  styleUrls: ['./arquivos.component.css']
})
export class ArquivosComponent implements OnInit {
  showModal: boolean = false;
  public data: Tipo[] = []
  public nCliente: number = 0;
  public ListaArquivos: Documento[] = []
  constructor(public shared: SharedService,
              public header: HeaderService,
              public dialog: MatDialog,
              public clienteService: ClienteService) {

  }
  ngOnInit(): void {

  }


  async MostraInfo(id: number, nome: string, descr: string, formato: string){

    this.shared.textoModal = 'Nome: ' + nome + ', descrição: ' + descr + ', formato: ' + formato
    this.shared.tituloModal = 'O que deseja fazer com o download do arquivo?'
    this.shared.nbotoes = ['Download do arquivo', 'Excluir  Arquivo', 'Fechar']
    const dialogRefConfirm = this.dialog.open(ModalConfirComponent, {

    });
    dialogRefConfirm.afterClosed().subscribe(result => {
        if (this.shared.respostaModal[0] == 'D'){
          this.trazerArq(id, nome);
        }
    });


  }
  async trazerArq(id: number, nome: string){
    const r = await this.shared.downloadDeArquivos(id, nome)
  }

}
