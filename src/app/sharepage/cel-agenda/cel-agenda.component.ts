
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
@Component({
  selector: 'app-cel-agenda',
  templateUrl: './cel-agenda.component.html',
  styleUrls: ['./cel-agenda.component.css']
})



export class CelAgendaComponent implements OnInit{
  /**
   *
   */
  public dia: string = new Date().toISOString().split('T')[0]
  ParImpar: string = this.agenda.calcSemanaSimNao(this.dia) =='P' ? 'P' : 'I';


  constructor(public agenda: Agenda2Service) {

  }
  ngOnInit(): void {
    this.dia = new Date(this.agenda.dia).toISOString().split('T')[0] !== undefined ? new Date(this.agenda.dia).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    console.log('Dia em agenda: ' + this.agenda.dia)
    console.log('Dia em data: ' + this.dia)
    const diaDaSemana = new Date(this.dia).getDay();
    const diasDaSemana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    this.agenda.diaSemana = diasDaSemana[diaDaSemana];
    this.ParImpar = this.agenda.calcSemanaSimNao(this.dia)  =='P' ? 'P' : 'I';

  }

  novaData(event: string){
    const partes = event.split('-'); // Dividindo a string nos separadores '/'

    // Obtendo os valores do dia, mês e ano a partir das partes divididas
    const dia = parseInt(partes[2], 10); // Convertendo para número inteiro
    const mes = parseInt(partes[1], 10) - 1; // O mês em JavaScript é baseado em zero (janeiro é 0)
    const ano = parseInt(partes[0], 10);

    // Criando o objeto Date com os valores extraídos
    const data = new Date(ano, mes, dia);

    const diaDaSemana = data.getDay();
    //const diaDaSemana = new Date(event).getDay();
    const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    //const diasDaSemana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    this.agenda.diaSemana = diasDaSemana[diaDaSemana];
    this.agenda.dia = event
    this.dia = event
    this.ParImpar = this.agenda.calcSemanaSimNao(this.dia)  =='P' ? 'P' : 'I';
    this.agenda.recarregar()
    console.log(this.agenda.dia)

  }
}
