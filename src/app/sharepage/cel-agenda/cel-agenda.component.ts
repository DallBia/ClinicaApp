import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Agenda } from 'src/app/models/Agendas';
import { AgendaService } from 'src/app/services/agenda/agenda.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { DonoSalaService } from 'src/app/services/donoSala/dono-sala.service';
@Component({
  selector: 'app-cel-agenda',
  templateUrl: './cel-agenda.component.html',
  styleUrls: ['./cel-agenda.component.css']
})



export class CelAgendaComponent implements OnInit, OnDestroy{
    public lin: number = 0;
    public col: number = 0;
    public linha1: string = '';
    public linha2: string = '';
    public l1: boolean = false;
    public c1: boolean = false;
    public agendaA!: Agenda;
    public agendaG!: Agenda[];
    public idCel: number = 0;
    public BuscaA: string = new Date().toISOString().split('T')[0] + '%1';
    private subscription!: Subscription;
    private subscription0!: Subscription;
    private subscription2!: Subscription;
    private subscription3!: Subscription;
    private subscription4!: Subscription;
    public nChanges: boolean = false;
    public UnitA: number = 0;
    public idCli: number = 0;
    public nomeProvisorio = '';
    public diaSemana: string = '';
    public nSemana: string = '';

    public nCli: string = '';
    public corDeFundo: string =  "rgb(255, 255, 255)";
    public nVezes: number = 0;
    public Vazia: Agenda = {
      id: 0,
      idCliente:0,
      nome:'',
      idFuncAlt:0,
      sala:0,
      dtAlt:'',
      status:'',
      repeticao:'',
      obs:'',
      horario:'',
      historico:'',
      diaDaSemana:'',
      dia:'',
    };

    public celAtual: Agenda = this.Vazia;





  @Input()  parametro!: string;
  public dados: any;

constructor(private agendaService: AgendaService,
            private clienteService: ClienteService,
            private donoSalaService: DonoSalaService,
            private colaboradorService: ColaboradorService,
             ){




}
MudarSala(l:number, c:number){

  const periodo = l == 0 ? 'manhã' : 'tarde';
  this.agendaService.dHora = this.agendaService.listaHorarios[this.lin].horario;
  this.agendaService.dSala = this.col;
  this.agendaService.dCliente = this.nCli;
  this.agendaService.setCelA(this.celAtual);
  this.agendaService.foto = '';
  for (let i of this.colaboradorService.dataSource){
    if(i.id == this.celAtual.idCliente){
      this.agendaService.foto = i.foto
    }
  }

  this.agendaService.visCol = true;
  this.agendaService.visCli = false;
  }

  AltHorario(l:number, c:number){
    const hor = this.agendaService.listaHorarios[l].horario;
    this.agendaService.setCelAnt(this.celAtual);
    this.clienteService.setListaCliente(this.clienteService.clientesG);
    this.agendaService.dCliente = '';
    this.agendaService.dHora = this.agendaService.listaHorarios[this.lin].horario;
    this.agendaService.dSala = this.col;
    this.agendaService.dCliente = this.nCli;
    for(let j of this.clienteService.clientes){
      if(j.nome == this.nCli){
        this.agendaService.dIdCliente = j.id ? j.id : 0;
        break;
      }
    }
    this.agendaService.foto = '';

  for (let i of this.clienteService.dataSource){
    if(i.id == this.celAtual.idCliente){
      this.agendaService.foto = i.foto
    }
  }
    this.agendaService.setCelA(this.celAtual);
    this.agendaService.visCol = false;
    this.agendaService.visCli = true;

  }

ngOnInit(){

  this.subscription = this.agendaService.EtapaA$.subscribe(
    name => {
      if(name == 2){
        this.agendaService.dCliente = '';
        this.celAtual = this.Vazia;
        this.nCli = '';
        this.agendaService.setCelA(this.Vazia);
        this.ReCarregar(this.BuscaA);
      }

    });

  this.subscription2 = this.agendaService.agendaG$.subscribe(
    name => {
      this.agendaG = name;
      //this.ReCarregar(this.BuscaA);
    });

  this.subscription3 = this.agendaService.UnitA$.subscribe(
    name => {

      this.UnitA = name
      this.agendaService.dCliente = '';
    });

  this.subscription4 = this.agendaService.BuscaA$.subscribe(
    name => {
      this.BuscaA = name
      this.agendaService.dCliente = '';
        this.ReCarregar(this.BuscaA);
    });


}

ReCarregar(x: string){

  this.celAtual = {
    id: 0,
      idCliente:0,
      nome:'',
      idFuncAlt:0,
      sala:0,
      dtAlt:'',
      status:'',
      repeticao:'',
      obs:'',
      horario:'',
      historico:'',
      diaDaSemana:'',
      dia:'',
  }
  const xpar = x.split('%');
  const dia = xpar[0] == '' ? new Date().toISOString().split('T')[0] : xpar[0];
  const unit = parseInt(xpar[1]) == 0 ? this.UnitA : parseInt(xpar[1]);

  const dono = this.donoSalaService.getDonoAtual;
  this.dados = this.parametro.split('%');
  this.lin = parseInt(this.dados[0]);
  this.col = parseInt(this.dados[1]);
  this.celAtual.unidade = unit;

// calcular o dia da semana:
  const hoje = new Date();
  const diaAgenda = new Date(dia);

  if (this.col == 0){
    this.linha1 = this.agendaService.listaHorarios[this.lin].horario.substring(0, 15);
    this.c1 = true;
    this.l1 = true;
    }else{
      if(this.lin == 0 || this.lin == 7){

        this.l1 = true;
      }else{

        this.corDeFundo = 'rgb(255, 255, 255)';
      }
      this.linha2 = '';
      this.linha1 = '';
      const agendaG = this.agendaService.getagendaG();
      for(let i of agendaG){
        if(i.sala == this.col &&
            i.unidade == unit &&
            i.horario == this.agendaService.listaHorarios[this.lin].horario
          ){
            switch  (i.repeticao){
              case 'Unica':
                this.celAtual.repeticao = 'Sessão única';
                break;
              case 'Diaria':
                this.celAtual.repeticao = 'Diária';
                break;
                case 'Semanal':
                this.celAtual.repeticao = 'Semanal';
                break;
              case 'Quinzenal':
                this.celAtual.repeticao = 'Quinzenal';
                break;
              case 'Mensal':
                this.celAtual.repeticao = 'Mensal';
                break;
              case 'Cancelar':
                this.celAtual.repeticao = 'Cancelar Repetição';
                break;
              default:
                this.celAtual.repeticao = 'Sessão única';
                break;
            }


            this.celAtual.id = i.id ? i.id : 0;
            this.celAtual.dia = i.dia ? i.dia : '';
            this.celAtual.diaDaSemana = i.diaDaSemana ? i.diaDaSemana : '';
            this.celAtual.dtAlt = i.dtAlt ? i.dtAlt : '';
            this.celAtual.historico = i.historico ? i.historico : '';
            // const hist = i.historico !== undefined && i.historico !== null ? i.historico : '';
            // const dHist = hist.split('֍') !== undefined ? hist.split('֍') : '';
            // if(dHist[1]){
            //   this.nomeProvisorio = dHist[0];
            //   i.historico = dHist[1];
            // }
            // this.celAtual.historico = i.historico ? i.historico : '';
            this.celAtual.horario = i.horario ? i.horario : '';
            this.celAtual.nome = i.nome ? i.nome : '';
            this.celAtual.idFuncAlt = i.idFuncAlt ? i.idFuncAlt : 0;
            this.celAtual.obs = i.obs ? i.obs : '';
            //this.celAtual.repeticao = i.repeticao ? i.repeticao : '';
            this.celAtual.sala = i.sala ? i.sala : 0;
            this.celAtual.status = i.status ? i.status : '';
            if(this.celAtual.status == 'Bloqueado'){
              this.linha1 = 'Horário bloqueado'
            }
            this.celAtual.subtitulo = i.subtitulo ? i.subtitulo : '';
            this.celAtual.idCliente = i.idCliente ? i.idCliente : 0;

            if(i.idCliente == 0){
              this.linha1 = i.nome !== undefined ? i.nome : '';
              //this.linha1 = this.nomeProvisorio;
              if(this.linha1.length > 18){
                this.linha1 = this.linha1.substring(0, 15) + '...'
              }
              //this.linha1 = this.nomeProvisorio.length > 18 ? this.nomeProvisorio.substring(0, 15) + '...' : this.nomeProvisorio;
              //this.nCli = this.nomeProvisorio;
              this.nCli = i.nome !== undefined ? i.nome : '';
            }else{
              if(this.lin == 0 || this.lin == 7){
                for(let j of this.colaboradorService.colaboradorsG){
                  if(j.id == i.idCliente){
                    this.idCli = j.id ? j.id : 0;
                    this.nCli = j.nome;
                    i.nome = j.nome
                    this.linha1 = j.nome.length > 18 ? j.nome.substring(0, 15) + '...' : j.nome
                  }
                }
              }else{
                for(let j of this.clienteService.clientes){
                if(j.id == i.idCliente){
                  this.idCli = j.id ? j.id : 0;
                  this.nCli = j.nome;
                  i.nome = j.nome
                  this.linha1 = j.nome.length > 18 ? j.nome.substring(0, 15) + '...' : j.nome
                }
              }
              }
            }
            const Lin2 = i.subtitulo ? i.subtitulo : '';
            this.linha2 = Lin2.length > 18 ? Lin2.substring(0, 15) + '...' : Lin2;
            switch (i.status) {
              case 'Vago':
                this.corDeFundo = 'rgb(255, 255, 255)';
                break;
              case 'Pendente':
                this.corDeFundo = 'rgb(195, 231, 255)';
                break;
              case 'Realizado':
                this.corDeFundo = 'lawngreen';
                break;
              case 'Desmarcado':
                this.corDeFundo = 'rgb(238, 200, 103)';
                break;
              case 'Falta':
                this.corDeFundo = 'rgb(231, 84, 113)';
                break;
              case 'Bloqueado':
                this.corDeFundo = 'silver';
                break;
              default:
                this.corDeFundo = 'rgb(255, 255, 255)';
          }
        }
      }
  }

}

get boxShadow(): string {
    const linha = this.agendaService.listaHorarios[this.lin].horario.substring(0, 15);
    if (linha === this.agendaService.dHora && this.col === this.agendaService.dSala) {
      return '0 0 10px rgba(0, 0, 0, 0.5)'; // Se as variáveis lin e col forem iguais, aplica o box-shadow
    } else {
      return 'none'; // Caso contrário, remove o box-shadow
    }
  }

    diaDaSemana(newDate: Date){
      var diaDaSemana = newDate.getDay();
      var diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
      this.diaSemana = diasDaSemana[diaDaSemana];
      //this.nSemana =
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe;
      this.subscription2.unsubscribe;
      this.subscription3.unsubscribe;
      this.subscription4.unsubscribe;

    }
}
