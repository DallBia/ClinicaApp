import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agenda } from 'src/app/models/Agendas';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../models/Response';
import { TableData } from 'src/app/models/Tables/TableData';


@Injectable({
  providedIn: 'root'
})
export class AgendaService {

    public Horarios = [
      {hora: 0, texto:'-', cor: 'Rosa'},
      {hora: 1, texto:'08:00', cor: 'Branco'},
      {hora: 2, texto:'08:50', cor: 'Branco'},
      {hora: 3, texto:'09:40', cor: 'Branco'},
      {hora: 4, texto:'10:30', cor: 'Branco'},
      {hora: 5, texto:'11:20', cor: 'Branco'},
      {hora: 6, texto:'12:10', cor: 'Branco'},
      {hora: 7, texto:'-', cor: 'Rosa'},
      {hora: 8, texto:'13:10', cor: 'Branco'},
      {hora: 9, texto:'14:00', cor: 'Branco'},
      {hora: 10, texto:'14:50', cor: 'Branco'},
      {hora: 11, texto:'15:40', cor: 'Branco'},
      {hora: 12, texto:'16:30', cor: 'Branco'},
      {hora: 13, texto:'17:20', cor: 'Branco'},
      {hora: 14, texto:'18:10', cor: 'Branco'},
      {hora: 15, texto:'19:00', cor: 'Branco'}
    ];

separador: string = '%';


delay(time:number) {
  setTimeout(() => {

  }, time);
}

}
