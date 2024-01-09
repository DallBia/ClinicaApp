import { Component, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Documento } from 'src/app/models/Documentos';
import { SharedService } from 'src/app/shared/shared.service';
import { HeaderService } from '../navbar/header.service';
import { Tipo } from 'src/app/models/Tipo';
import { ClienteService } from 'src/app/services/cliente/cliente.service';

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
              public clienteService: ClienteService) {

  }
  ngOnInit(): void {

  }


  async MostraInfo(id: number, nome: string){
    const r = await this.shared.downloadDeArquivos(id, nome)
  }

}
