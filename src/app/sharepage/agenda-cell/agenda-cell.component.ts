import { Component, Input } from '@angular/core';
import { Agenda } from 'src/app/models/Agendas';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { DonoSalaService } from 'src/app/services/donoSala/dono-sala.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-agenda-cell',
  templateUrl: './agenda-cell.component.html',
  styleUrls: ['./agenda-cell.component.css']
})
export class AgendaCellComponent {
  public lin: number = 0;
  public col: number = 0;
  public linha1: string = '';
  public linha2: string = '';
  public l1: boolean = false;
  public c1: boolean = false;
  public corDeFundo: string =  "rgb(255, 255, 255)";
  public identif: number = 0;




@Input()  parametro!: string;
public dados: any;

  constructor(public agendaService: Agenda2Service,
            private shared: SharedService,

            )
  {

  }



ngOnInit(){

this.gerarIdent()
this.shared.delay(200)
  this.l1 = this.lin == 0 ? true : false;
  this.c1 = this.col == 0 ? true : false;
  if (this.col == 0){
    for (let i of this.agendaService.listaHorarios){
      if (i.n == this.lin){
        this.linha1 = i.horario;
      }
    }
  }
    this.agendaService.agendaDia$.subscribe((novaAgendaDia) => {
        this.atualizarNomeCorrespondente();
    });
}

gerarIdent(){
  const xpar = this.parametro.split('%');
  this.lin = parseInt(xpar[0]);
  this.col = parseInt(xpar[1]);
  const h = this.lin * 100;
  this.identif = h + this.col;
}



async atualizarNomeCorrespondente() {
 //  if(this.agendaService.agendaDia.length !== 0){
    if (this.identif == 0){
      const r = await this.gerarIdent()
    }
    const item = this.agendaService.agendaDia.find(item => item.idtmp === this.identif);
    if(this.col !== 0){
      this.linha1 = '';
      this.linha2 = '';
      this.corDeFundo = 'rgb(255, 255, 255)';
    }
    // Verifique se o item foi encontrado antes de acessar o nome
    if (item) {
      this.linha1 = item.nome !== undefined ? item.nome : '';
      this.linha2 = item.subtitulo !== undefined ? item.subtitulo : '';
      const x = this.agendaService.dia + '%' + this.agendaService.un;
      //console.log('Em ' + item.idtmp + ' mudamos para ' + this.linha1 + '/' + this.linha2)
      this.ReCarregar(x)
    }
  //}
}
ReCarregar(x: string){

const xpar = x.split('%');
const dia = xpar[0] == '' ? new Date().toISOString().split('T')[0] : xpar[0];
const unit = parseInt(xpar[1]) == 0 ? this.agendaService.un : parseInt(xpar[1]);
this.dados = this.parametro.split('%');
this.lin = parseInt(this.dados[0]);
this.col = parseInt(this.dados[1]);

if (this.col == 0){
  this.linha1 = this.agendaService.listaHorarios[this.lin].horario.substring(0, 15);
  this.c1 = true;
  this.l1 = true;
  }else{
    if(this.lin == 0 || this.lin == 7){
      this.l1 = true;
      this.c1 = false;

    }else{
      this.corDeFundo = 'rgb(255, 255, 255)';
    }
    this.linha2 = '';
    this.linha1 = '';
    const agendaD = this.agendaService.agendaDia;
    for(let i of agendaD){
      if(i.idtmp == this.identif){

        this.linha1 = i.nome !== undefined ? i.nome : '';
        this.linha2 = i.subtitulo !== undefined ? i.subtitulo : '';
        this.linha1 = this.linha1.length > 18 ? this.linha1.substring(0, 15) + '...' : this.linha1;
        this.linha2 = this.linha2.length > 18 ? this.linha2.substring(0, 15) + '...' : this.linha2;

          switch (i.status) {
            case 'Vago':
              this.corDeFundo = 'white';
              break;
            case 'Pendente':
              this.corDeFundo = 'lightblue';
              break;
            case 'Realizado':
              this.corDeFundo = 'lawngreen';
              break;
            case 'Desmarcado':
              this.corDeFundo = 'khaki';
              break;
            case 'Falta':
              this.corDeFundo = 'indianred';
              break;
            case 'Bloqueado':
              this.corDeFundo = 'rgb(42, 42, 55)';
              break;
            case 'Reservado':
              this.corDeFundo = 'silver';
              break;
            default:
              this.corDeFundo = 'rgb(255, 255, 255)';
        }
      }
    }
}

}


MudarSala(lin: number, col: number){
  this.agendaService.hora = lin;
  this.agendaService.sala = col;
  this.agendaService.carregarSala()
  this.agendaService.carregarCel()
}
AltHorario(lin: number, col: number){
  this.agendaService.hora = lin;
  this.agendaService.sala = col;
  this.agendaService.carregarCel()

}

get boxShadow(): string {
  if (this.lin === this.agendaService.hora && this.col === this.agendaService.sala) {
    return '0 0 10px rgba(0, 0, 0, 0.5)'; // Se as variáveis lin e col forem iguais, aplica o box-shadow
  } else {
    return 'none'; // Caso contrário, remove o box-shadow
  }
}

  ngOnDestroy(): void {


  }
}
