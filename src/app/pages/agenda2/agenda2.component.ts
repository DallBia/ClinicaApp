import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
// import { DonoSalaService } from 'src/app/services/donoSala/dono-sala.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-agenda2',
  templateUrl: './agenda2.component.html',
  styleUrls: ['./agenda2.component.css']
})
export class Agenda2Component implements OnInit, OnDestroy{

  public colunas: number[] = [];
  public linhas: number[] = [];
  private valid1: any = null;
  constructor (private agendaService: Agenda2Service,
    private clienteService: ClienteService,
    private userService: UserService,
    public shared: SharedService,
    // public donoSala: DonoSalaService,

    ) {

}

  ngOnInit(){

      this.main()
      this.buscaClientes()
      this.buscaEquipe()
      this.colunas = [];
      this.linhas = [];
      for (let i = 0; i <= 30; i++) {
        this.colunas.push(i);
      }
      for (let j = 1; j <= 15; j++) {
        this.linhas.push(j);
      }

    this.agendaService.cellA$.subscribe((novoValor) => {

    });

  }




  delay(time:number) {
    setTimeout(() => {

    }, time);
  }



  ngOnDestroy(){
    window.localStorage.removeItem('AgAnt-id');
    window.localStorage.removeItem('AgAnt-nome');
    window.localStorage.removeItem('AgAnt-rept');
    window.localStorage.removeItem('AgAnt-profis');
    window.localStorage.removeItem('AgAnt-status');
    window.localStorage.removeItem('AgAnt-diaI');
    window.localStorage.removeItem('AgAnt-diaF');
  }



  async main(){
    try {
      this.valid1 = await this.agendaService.BuscaAgenda(this.agendaService.dia)

    }
    catch(error)   {
      console.error('Erro ao buscar agenda:', error);
    }
  }

  async buscaClientes(){
    try {
      this.valid1 = await this.agendaService.BuscaClientes()
      console.log(this.agendaService.ListaCLientes)
    }
    catch(error)   {
      console.error('Erro ao buscar Clientes:', error);
    }
  }

  async buscaEquipe(){
    try {
      this.valid1 = await this.agendaService.BuscaColab('nome')
      console.log(this.agendaService.ListaEquipe)
    }
    catch(error)   {
      console.error('Erro ao buscar Equipe:', error);
    }
  }


}


