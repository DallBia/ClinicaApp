import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../navbar/header.service';
import { AgendaService } from 'src/app/services/agenda/agenda.service';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';

@Component({
  selector: 'app-custom-date',
  templateUrl: './custom-date.component.html',
  styleUrls: ['./custom-date.component.css']
})
export class CustomDateComponent {
  // displayedDate: Date = new Date();
  // semana = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
  // diaSemana: string = '';
  // dia: string = '';
  // Unit: number = 0;
  // subscription!: Subscription;
  // changes: boolean = false;
  // ctrl: boolean = false;
  // ParImpar: string = this.agenda2.calcSemanaSimNao(this.displayedDate.toISOString().split('T')[0]) =='P' ? 'P' : 'I';

  // constructor(
  //             public agenda2: Agenda2Service,
  //             ){}

  // onDateChange(newDate: Date) {
  //   const diaDaSemana = newDate.getDay();
  //   const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  //   this.diaSemana = diasDaSemana[diaDaSemana];
  //   this.dia = newDate.toISOString();
  //   const novoDia = new Date(newDate).toISOString().split('T')[0]
  //   this.agenda2.diaSemana = this.diaSemana
  //   this.agenda2.dia = novoDia;
  //   const nDia = newDate.toLocaleDateString()
  //   this.ParImpar = this.agenda2.calcSemanaSimNao(nDia)  =='P' ? 'P' : 'I';
  //   this.agenda2.diaSemana = this.diaSemana
  //   this.agenda2.recarregar();
  //   this.agenda2.recarregar();
  // }

  // onDivClick(newDate: Date) {


  //   //this.onDateChange(dia);
  //   const diaDaSemana = newDate.getDay();
  //   const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  //   this.diaSemana = diasDaSemana[diaDaSemana];
  //   this.agenda2.diaSemana = this.diaSemana
  //   this.dia = newDate.toISOString();
  //   const novoDia = new Date(newDate).toISOString().split('T')[0]
  //   this.agenda2.dia = novoDia;
  //   const nDia = newDate.toLocaleDateString()
  //   this.ParImpar = this.agenda2.calcSemanaSimNao(nDia)  =='P' ? 'P' : 'I';
  //   this.agenda2.diaSemana = this.diaSemana
  //   this.agenda2.recarregar();
  // }



  // ngOnInit(): void {
  //   // this.subscription = this.agendaService.UnitA$.subscribe(
  //   //   name => this.Unit = name
  //   // )
  // }

}



