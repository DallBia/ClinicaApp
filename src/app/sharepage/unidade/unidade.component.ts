import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AgendaService } from 'src/app/services/agenda/agenda.service';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';

@Component({
  selector: 'app-unidade',
  templateUrl: './unidade.component.html',
  styleUrls: ['./unidade.component.css']
})
export class UnidadeComponent implements OnInit {
public x: boolean = true;
public Ligado = [
  {fontWeight: 'bolder', fontSize:'x-large',porc:'75%',porc2:'76%'}
]

ngOnInit(){


}
constructor(public agenda: Agenda2Service) {


}


ToggleUnit(){
  this.x = !this.x;
  const xdia = this.agenda.dia;
  if(this.x == true){
    this.agenda.un = 1
    console.log('Unidade 1')
  }else{
    this.agenda.un = 2
    console.log('Unidade 2')
  }
  this.agenda.recarregar();
}

}
