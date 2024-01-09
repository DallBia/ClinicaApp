import { SharedService } from '../../shared/shared.service';  // Atualize o caminho
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { TableData } from 'src/app/models/Tables/TableData';
import { Subscription } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { FormClienteComponent } from '../form-cliente/form-cliente.component';
import{FileService}from '../../services/foto-service.service';


@Component({
  selector: 'app-grid01',
  templateUrl: './grid01.component.html',
  styleUrls: ['./grid01.component.css']
})
export class Grid01Component {
  public caminho: string = '';
  dataSource: TableData[] = [];
  public nLin: TableData[] = [];
  public Verifica: boolean = false;
  subscription: Subscription;
  nChanges!: boolean;
  @ViewChild(FormClienteComponent) formCli!: FormClienteComponent;

  ngOnInit(): void {

    this.clienteService.BuscaClientes()
    this.sharedService.btnAnexCli = false;

  }

  destacarLinha(l:any, lFicha: string) {

    this.nChanges = false;
    this.clienteService.setChangesA(false);
    let numero = parseInt(l.Ficha, 10);
      if (isNaN(numero)) {
        numero = 0;
    }
    this.sharedService.ClienteAtual = numero;
    this.sharedService.btnAnexCli = true;
    const dados = this.clienteService.clientesG.find(cliente => cliente.id === numero);
    if (dados !== undefined){
      this.sharedService.ListaClientes = dados;
    }
    this.clienteService.dataSource.forEach(l => l.selecionada = false);// Desmarcar todas as outras linhas
    this.clienteService.setClienteA(numero);

    this.clienteService.setClienteAtual(this.clienteService.dataSource.find(cliente => parseInt(cliente.Ficha, 10) === numero) || this.clienteService.Vazia[0]);

    l.selecionada = true;
    this.sharedService.PessoaDoctos = "C";
    this.sharedService.carregarListaDeArquivos()
    this.nChanges = true;
    setTimeout(() => {
      this.clienteService.setChangesA(true);
    }, 0)
  }



  constructor(private sharedService: SharedService, public clienteService: ClienteService) {

    this.subscription = this.clienteService.ChangesA$.subscribe(
      name => this.nChanges = name
    )

  }

}
