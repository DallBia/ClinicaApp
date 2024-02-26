import { Tipo } from 'src/app/models/Tipo';
import { DadosformComponent } from './../dadosform/dadosform.component';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Agenda } from 'src/app/models/Agendas';
import { Financeiro } from 'src/app/models/Financeiro';
import { UserService } from 'src/app/services';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { FinanceiroService } from 'src/app/services/financeiro/financeiro.service';
import { FileService } from 'src/app/services/foto-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalMultiComponent } from './modal-multi/modal-multi.component';
import { Router } from '@angular/router';
import { Perfil } from 'src/app/models/Perfils';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Cliente } from 'src/app/models/Clientes';
import { is } from 'date-fns/locale';


@Component({
  selector: 'app-agenda-menu',
  templateUrl: './agenda-menu.component.html',
  styleUrls: ['./agenda-menu.component.css']
})
export class AgendaMenuComponent implements OnInit {

    constructor(
      public agendaService: Agenda2Service,
      public foto: FileService,
      private perfilService: PerfilService,
      public clienteService: ClienteService,
      public shared: SharedService,
      public userService: UserService,
      public financeiroService: FinanceiroService,
      public dialog: MatDialog,
      private router: Router,

    ){}
      public subscription1: Subscription | undefined;
      public fotografia: any = false
      public subscription: Subscription | undefined;
      private StatAnt: string = '';
      private cellAnt!: Agenda;



  ngOnInit(): void {
      this.agendaService.buscaData()
      this.shared.BuscaValores()
      this.subscription = this.agendaService.segueModal$.subscribe(Segue => {
        if (Segue == true){
          this.agendaService.atualizarsegueModal(false);
          const dialogRef = this.dialog.open(ModalMultiComponent, {
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('O modal foi fechado.');
            this.subscription?.unsubscribe
          });
        }
      });


      this.subscription1 = this.agendaService.cellA$.subscribe(valor => {
        this.cellAnt = valor
        console.log('Novo valor de cellA:')
        console.log(valor)
      });
  }

    public Vlr: boolean = true;

    buscaValor(){
      for(let i of this.shared.ListaValores){
        if (this.agendaService.celSelect.subtitulo == i.nome && this.agendaService.celSelect.valor == -1000009){
          this.agendaService.celSelect.valor = i.valor
        }
      }
      if(this.agendaService.celSelect.subtitulo == 'Avaliação Multidisciplinar'){
        this.openModal(10, 'X')
      }
      if(this.agendaService.celSelect.subtitulo == 'Avaliação Neuropsicológica'){
        this.openModal(5, 'X')
      }
      if(this.agendaService.celSelect.subtitulo == 'Reforço Escolar - Pacote 05'){
        this.openModal(5, 'X')
      }
      if(this.agendaService.celSelect.subtitulo == 'Reforço Escolar - Pacote 10'){
        this.openModal(10, 'X')
      }
      if(this.agendaService.celSelect.subtitulo == 'Reforço Escolar - Pacote 20'){
        this.openModal(20, 'X')
      }
      if(this.agendaService.celSelect.subtitulo == 'Reforço Escolar - Pacote 30'){
        this.openModal(30, 'X')
      }
    }
    openModal(n: number, tipo: string): void {
      if (this.perfilService.validaPerfil(0,12) == false){
        alert('Você não tem permissão para alterar agendas.')
      }else{

      let r: any = 0;
      console.log(this.agendaService.ListaValores)
      this.agendaService.agendaNsessoes = n
      if(n >0){
        let id00 = new Date()
        let id01 = id00.toISOString()
        id01 = id01.replace(/\D/g, '')
        this.agendaService.numReserva = id01
        const vlr = this.agendaService.celSelect.valor !== undefined  && this.agendaService.celSelect.valor !== null ? this.agendaService.celSelect.valor : 0;
        const valorSess: number = this.agendaService.celSelect.valor !== undefined && this.agendaService.celSelect.valor !== null ? this.agendaService.celSelect.valor / n : 0;
        this.agendaService.valorStr = this.transformarNumeroEmString(vlr)
        for (let i = 0; i < n; i++) {
          const lin = {
            id: i,
            sessao: (i+1).toString(),
            profis: '',
            dia: '',
            hora: '',
            status: '',
            valor: valorSess,
          }
          this.agendaService.ListaAgenda.push(lin);
        }
        this.agendaService.atualizarsegueModal(true);
      }else{
        this.agendaService.tipoDeAgendamento = 'Existente'
        this.agendaService.numReserva = tipo
        const parm = 'id|' + this.agendaService.numReserva.toString()
        r = this.BuscaAg(parm);
      }
    }
    }

    transformarNumeroEmString(num: number): string {
      const parteInt = Math.floor(num);
      let parteFrac = num - parteInt;
      parteFrac = (Math.floor(parteFrac * 100))/100;
      num = parteInt + parteFrac;
      const v = num.toString();
      return v;

    }



async BuscaAg(p: string){
  const resp = await this.agendaService.getAgendaByReserva(p);
  return resp.dados

}




    buscaFoto(){
      let id = 0
      for (let i of this.agendaService.ListaCLientes){
        if (this.agendaService.celSelect.nome == i.nome){
          id = i.id;
        }
      }
      if (id !== 0){
        this.agendaService.BuscaCliente(id)
      }else{
        this.agendaService.Cliente.foto = this.foto.semfoto2
      }
    }

    altVlr(){
      this.Vlr = !this.Vlr
      if (this.agendaService.celSelect.valor !== undefined && this.agendaService.celSelect.valor !== null){
        if(this.agendaService.celSelect.valor < 0){
        this.agendaService.celSelect.valor = 0;
        }
      }
    }


    setStatus(status: string){
      if(status == 'Bloqueado'){
        let valSt = false

        if(this.cellAnt.status == '' || this.cellAnt.status == 'Vago'){
          valSt = true
        }
        if (this.agendaService.celSelect.nome !== ''
            || valSt !== true){
              alert('Só é possível bloquear um horário vago. Por favor, limpe o horário antes de bloquear.');
        }else{
          this.agendaService.celSelect.status = status;
          this.agendaService.celSelect.subtitulo = '(bloqueado)';
        }
      }else{
        this.agendaService.celSelect.status = status;
      }

    }

    verProfCli(): string{
        if (this.agendaService.celSelect.horario !== 'manhã' && this.agendaService.celSelect.horario !== 'tarde'){
          return 'C'
        }
        else
        {
          return 'E'
        }
    }
    verSubst(prof: string | undefined): string{
      if (prof !== undefined){
        if (prof !==''){
          if(window.localStorage.getItem('AgAnt-nome') !== null){
          if (window.localStorage.getItem('AgAnt-nome') !== ''){
            if (this.agendaService.celSelect.repeticao == 'Cancelar Repetição'){
              return 'Exclusão'
            }else{
              return 'Substituição'
            }
          }else{
            return 'Inserção'
          }
          }else{
            return 'Inserção'
          }
        }else{
          return 'Exclusão'
        }
      }else{
        return 'Exclusão'
      }
    }


    private ok: boolean = false;
    async validacoes(){
      const pessoa = this.verProfCli()
      const alter = this.verSubst(this.agendaService.celSelect.nome)
      const rept = this.agendaService.celSelect.repeticao
      let dSem = ''
      let pi = ''
      let sessao = '';
        let dataFim = new Date().toISOString();
        let dataIni = new Date().toISOString();
        let status = 'Pendente'
      try{
        switch (this.agendaService.celSelect.repeticao){
          case 'Sessão única':
            sessao = 'Unica';
            status = this.agendaService.celSelect.status !== undefined ? this.agendaService.celSelect.status : 'Pendente';
            this.agendaService.celSelect.configRept = "X";
            dataFim = this.agendaService.dia
            dataIni = this.agendaService.dia
            break;
          case 'Diária':
            sessao = 'Diaria';
            this.agendaService.celSelect.configRept = "D%" + this.agendaService.dia.substring(0,2) + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
            break;
          case 'Semanal':
            sessao = 'Semanal';
            this.agendaService.celSelect.configRept = "S%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
            break;
          case 'Quinzenal':
            sessao = 'Quinzenal';
            this.agendaService.celSelect.configRept = "Q%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
            break;
          case 'Mensal':
            sessao = 'Mensal';
            this.agendaService.celSelect.configRept = "M%" + this.agendaService.diaSemana + '%' + this.agendaService.dia.substring(0,2)
            dataFim = '2100-01-01'
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
            break;
          case 'Cancelar Repetição':
            sessao = 'Cancelar';
            dataFim = this.diaAnterior(this.agendaService.dia)
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
            break;
          default:
            sessao = 'Unica';
            dataFim = this.agendaService.dia
            status = this.agendaService.celSelect.status !== undefined ? this.agendaService.celSelect.status : 'Pendente';
            dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
        }
        dSem = this.agendaService.celSelect.configRept.split('%')[1] == undefined ? '' : this.agendaService.celSelect.configRept.split('%')[1]
        pi = this.agendaService.celSelect.configRept.split('%')[2] == undefined ? '' : this.agendaService.celSelect.configRept.split('%')[2]
      }catch{}
      let texto01: string = '';
      const Xsala = this.agendaService.celSelect.sala !== undefined ? this.agendaService.celSelect.sala.toString() : '0'
      const Xhora = this.agendaService.celSelect.horario
      const Xid = this.agendaService.celSelect.id !== undefined ? this.agendaService.celSelect.id.toString() : '0'
      const Yid = this.agendaService.celSelect.id !== undefined ? this.agendaService.celSelect.id : 0;
      const Xdia = this.agendaService.dia
      const h = this.agendaService.celSelect
      const Xdado = Xsala + '%' + Xhora + '%' + Xid + '%' + Xdia
      const r = await this.agendaService.verifAgenda(Yid,Xdado)
      for (let i of this.agendaService.conflitos){
        let txt = ''
        const r2 = i.configRept.split('%')
        /* SE FOR EQUIPE (DONO DA SALA):*/
        if (pessoa == 'E'){   // é dono da sala
          switch (alter[0]){
            case 'I':
              switch (rept){
                case 'Diária':
                  let iDiaI = i.diaI !== undefined && i.diaI !== null ? new Date(i.diaI) : new Date();
                  let iDiaF = i.diaF !== undefined && i.diaF !== null ? new Date(i.diaF) : new Date();
                  let hDiaI = new Date(dataIni)
                  let hDiaF = new Date(dataFim)
                //Primeiro, vejo se a mesma sala já está ou estará ocupada por outro profissional:
                  if(i.sala == h.sala
                        && i.horario == h.horario
                        && i.idCliente !== h.idCliente
                        && iDiaI < hDiaF){
                    const varI = i.configRept.split('%')
                    let hRep = ''
                    let hSem = ''
                    let hData = ''
                    switch (varI[0]){
                      case 'D':
                        hRep = 'diária'
                        hData = ', de ' + iDiaI.toLocaleDateString() + ' a ' + iDiaF.toLocaleDateString()
                        break;
                      case 'S':
                        hRep = 'semanal'
                        hSem = ' às ' + varI[1]
                        hData = ', de ' + iDiaI.toLocaleDateString() + ' a ' + iDiaF.toLocaleDateString()
                        break;
                      case 'Q':
                        hRep = 'quinzenal'
                        hSem = ' às ' + varI[1] + varI[2] == 'P' ? ' pares (brancas)' : 'ímpares (vermelhas)'
                        hData = ', de ' + iDiaI.toLocaleDateString() + ' a ' + iDiaF.toLocaleDateString()
                        break;
                      default:
                        hRep: 'pontual (sessão única)'
                        hData = ', em ' + iDiaI.toLocaleDateString()
                        break;
                    }
                    txt = txt + 'O funcionário ' + i.nome + ' já está nesta sala em sessão ' + hRep + hSem + hData + '.\n'
                  }
                //Agora, vejo se o mesmo profissional já está em outra sala no(s) mesmo(s) dia(s):
                  if (i.sala !== h.sala
                        && i.horario == h.horario
                        && i.idCliente == h.idCliente
                        && iDiaI < hDiaF){
                          txt = txt + 'O funcionário ' + h.nome + ' já está na sala ' + i.sala + ' entre os dias '

                  }
                  break;
                case 'Semanal':

                  break;
                case 'Quinzenal':

                  break;
                case 'Cancelar Repetição':

                  break;
                default:

                  break;
              }
              break;
            case 'E':

              break;
            case 'S':

              break;
            default:
              break;
          }

        }else{ // é cliente

        }

        texto01 = texto01 + txt
      }
      console.log(texto01)
    }

    compara(a: Agenda, b: Agenda){
      /* SE FOR EQUIPE (DONO DA SALA):*/

      /*SE FOR UMA SESSÃO DE REPETIÇÃO QUE NÃO CASAR COM AS REPETIÇÕES DO DONO DA SALA */

    }


  haDonoSala(): boolean{
    let resp = false
    this.agendaService.celSelect.profis = '';
    if (this.agendaService.celSelect.horario !== 'manhã' && this.agendaService.celSelect.horario !== 'tarde'){
      let hora = this.agendaService.celSelect.horario?.substring(0,2) !== undefined ? this.agendaService.celSelect.horario?.substring(0,2) : '00';
      let periodo = parseInt(hora) > 12 ? 'tarde' : 'manhã'
      for (let a of this.agendaService.agendaDia){
        if (a.sala == this.agendaService.celSelect.sala && a.horario == 'manhã'){
          this.agendaService.celSelect.profis = a.nome
        }
      }
      for (let a of this.agendaService.agendaDia){
        if (a.sala == this.agendaService.celSelect.sala && a.horario == periodo){
          this.agendaService.celSelect.profis = a.nome
        }
      }
    }
    resp = this.agendaService.celSelect.profis !== '' && this.agendaService.celSelect.profis !== undefined ? true : false;
    return resp;
  }






public diff: boolean = true
    async salvaSessao(){
      /* validações*/


       /* fim das validações*/


      if (this.perfilService.validaPerfil(0,11) == false){
        alert('Você não tem permissão para alterar agendas.')
      }else{
        if(this.agendaService.celSelect.horario !== 'manhã' && this.agendaService.celSelect.horario !== 'tarde'){
           this.diff = this.haDonoSala()
        }


        if (this.diff == true){
        let sessao = '';
        let dataFim = new Date().toISOString();
        let dataIni = new Date().toISOString();
        let status = 'Pendente'
        if (this.agendaService.celSelect.horario !== 'manhã' && this.agendaService.celSelect.horario !== 'tarde'){
          let hora = this.agendaService.celSelect.horario?.substring(0,2) !== undefined ? this.agendaService.celSelect.horario?.substring(0,2) : '00';
          let periodo = parseInt(hora) > 12 ? 'tarde' : 'manhã'
          for (let a of this.agendaService.agendaDia){
            if (a.sala == this.agendaService.celSelect.sala && a.horario == periodo){
              this.agendaService.celSelect.profis = a.nome
            }
          }
        }

        const reptOriginal = this.agendaService.celSelect.repeticao
        this.agendaService.celSelect.idCliente = 0;
         if (this.agendaService.celSelect.status == 'Sala'){
          for(let n of this.agendaService.ListaEquipe){
            if (this.agendaService.celSelect.nome == n.nome){
              this.agendaService.celSelect.idCliente = n.id;
            }
          }
        }else{
          for(let n of this.agendaService.ListaCLientes){
            if (this.agendaService.celSelect.nome == n.nome){
              this.agendaService.celSelect.idCliente = n.id;
            }
          }
        }
        if (this.agendaService.celSelect.status == 'Sala' || this.agendaService.celSelect.status == 'Pendente' || this.agendaService.celSelect.status == ''){
          status = this.agendaService.celSelect.status
          switch (this.agendaService.celSelect.repeticao){
            case 'Sessão única':
              sessao = 'Unica';
              status = this.agendaService.celSelect.status !== undefined ? this.agendaService.celSelect.status : 'Pendente';
              this.agendaService.celSelect.configRept = "U%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar;
              dataFim = this.agendaService.dia
              dataIni = this.agendaService.dia
              break;
            case 'Diária':
              sessao = 'Diaria';
              this.agendaService.celSelect.configRept = "D%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar;
              dataFim = '2100-01-01'
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
              break;
            case 'Semanal':
              sessao = 'Semanal';
              this.agendaService.celSelect.configRept = "S%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
              dataFim = '2100-01-01'
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
              break;
            case 'Quinzenal':
              sessao = 'Quinzenal';
              this.agendaService.celSelect.configRept = "Q%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
              dataFim = '2100-01-01'
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
              break;
            case 'Mensal':
              sessao = 'Mensal';
              this.agendaService.celSelect.configRept = "M%" + this.agendaService.diaSemana + '%' + this.agendaService.dia.substring(0,2)
              dataFim = '2100-01-01'
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
              break;
            case 'Cancelar Repetição':
              sessao = 'Cancelar';
              dataFim = this.diaAnterior(this.agendaService.dia)
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
              break;
            default:
              sessao = 'Unica';
              this.agendaService.celSelect.configRept = "U%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar;
              dataFim = this.agendaService.dia
              status = this.agendaService.celSelect.status !== undefined ? this.agendaService.celSelect.status : 'Pendente';
              dataIni = this.agendaService.celSelect.diaI !== undefined && this.agendaService.celSelect.diaI !== '' ? this.agendaService.celSelect.diaI : this.agendaService.dia
          }
        }else{
          sessao = 'Unica';
          this.agendaService.celSelect.configRept = "U%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar;
          dataFim = this.agendaService.dia;
          dataIni = this.agendaService.dia;
          status = this.agendaService.celSelect.status !== undefined ? this.agendaService.celSelect.status : 'Pendente';
        }



        let texto = '';
        const dataAtual = new Date();
        const horas = dataAtual.getHours();
        const minutos = dataAtual.getMinutes();

        const horaFormatada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        const Usr = this.userService.getUserA().getValue();
        if (this.agendaService.celSelect.horario == 'manhã'|| this.agendaService.celSelect.horario == 'tarde'){
          this.agendaService.celSelect.status == 'Sala';
        }else{
          if (this.cellAnt.status == ''|| this.cellAnt.status == 'Vago'){
            texto = 'Agendamento de ' + this.agendaService.celSelect.subtitulo + '. ';
            this.agendaService.celSelect.status == 'Pendente';
          }
        }

        if(this.agendaService.celSelect.status == 'Vago'){
          texto = 'Sessão anterior Excluída.';
          status = 'Vago'
          this.agendaService.celSelect.repeticao = 'Cancelar';
          this.agendaService.celSelect.subtitulo ='';
          this.agendaService.celSelect.nome = '';
          this.agendaService.celSelect.idCliente = 0;
          this.agendaService.celSelect.subtitulo = '';
          this.agendaService.celSelect.obs = '';
          this.agendaService.celSelect.valor = null;
        }else{
          if(this.cellAnt.repeticao !== this.agendaService.celSelect.repeticao){
            texto += 'Repetição alterada: de ' + this.cellAnt.repeticao + ' para ' + this.agendaService.celSelect.repeticao + '. '
          }
          if(this.cellAnt.valor !== this.agendaService.celSelect.valor){
            texto += 'Valor alterado: de ' + this.cellAnt.valor + ' para ' + this.agendaService.celSelect.valor + '. '
          }
          if(this.cellAnt.nome !== this.agendaService.celSelect.nome){
            texto += 'Cliente alterado: de ' + this.cellAnt.nome + ' para ' + this.agendaService.celSelect.nome + '. '
          }
          if(this.cellAnt.status !== this.agendaService.celSelect.status){
            texto += 'Novo Status: ' + this.agendaService.celSelect.status + '. '
          }
        }

        this.agendaService.celSelect.repeticao = sessao;
        if (this.agendaService.celSelect.repeticao == '' || this.agendaService.celSelect.repeticao == undefined){
          this.agendaService.celSelect.repeticao = 'Unica'
        }
        dataIni = dataIni !== '' ? new Date(dataIni).toISOString() : new Date(this.agendaService.dia).toISOString();
        this.agendaService.celSelect.status = this.agendaService.celSelect.horario == 'manhã' || this.agendaService.celSelect.horario == 'tarde' ? 'Sala' :  this.agendaService.celSelect.status;
        let Histmp = '%' + new Date().toLocaleDateString('pt-BR') + ' - ' +  horaFormatada + ':\n' + texto  + '\npor: ' + Usr?.name + '\nꟷꚚꟷ\n';
        this.agendaService.celSelect.historico += Histmp;
        const usrId = Usr?.userid !== undefined ? parseInt(Usr?.userid, 10) : 0;
        this.agendaService.celSelect.idFuncAlt = usrId
        this.agendaService.celSelect.diaI = dataIni//new Date(dataIni).toISOString();
        this.agendaService.celSelect.diaF = dataFim //new Date(dataFim).toISOString();
        this.agendaService.celSelect.unidade = this.agendaService.celSelect.valor !== null && this.agendaService.celSelect.valor !== undefined ? this.agendaService.celSelect.valor : 1;
        this.agendaService.celSelect.horario = this.agendaService.horario;
        this.agendaService.celSelect.sala = this.agendaService.sala;
        this.agendaService.celSelect.dtAlt = new Date().toISOString();
        this.agendaService.celSelect.status = status
        if (this.agendaService.celSelect.subtitulo !== undefined){
          this.agendaService.celSelect.subtitulo = this.agendaService.celSelect.subtitulo.length == 0 ? '' : this.agendaService.celSelect.subtitulo
        }else{
          this.agendaService.celSelect.subtitulo = '';
        }
        // AJUSTE DE DATA
        this.agendaService.celSelect.diaF = this.shared.datas(this.agendaService.celSelect.diaF, 'Banco')
        this.agendaService.celSelect.diaI = this.shared.datas(this.agendaService.celSelect.diaI, 'Banco')
        this.agendaService.celSelect.dtAlt = this.shared.datas(this.agendaService.celSelect.dtAlt, 'Banco')
        //----------------------------------------------------------------------------
        // AJUSTE DE STATUS:

        if (this.agendaService.celSelect.status.length < 2){
          this.agendaService.celSelect.status = 'Pendente';
        }

        //-----------------------------------------------------------------------
        //SALVA O FINANCEIRO CASO REALIZADA OU FALTA
        if(this.agendaService.celSelect.status == 'Realizado' || this.agendaService.celSelect.status == 'Falta'){
          if (this.agendaService.celSelect.unidade > 0){
            const dado: Tipo = {
              id: this.agendaService.celSelect.idCliente,
              nome: this.agendaService.celSelect.unidade + '|' + this.agendaService.celSelect.id + '|' + this.agendaService.celSelect.idFuncAlt
            }
            const rFin = await this.financeiroService.validarSaldo(dado);
            try{
              const vlr = parseFloat(rFin)
              this.agendaService.celSelect.unidade = vlr;
            }catch{
            }

          }

        }

        //------------

        if(this.agendaService.celSelect.id == 0 || this.agendaService.celSelect.id == undefined){
          this.agendaService.celSelect.id = 0
          console.log(this.agendaService.celSelect)
          this.salvaAgenda(this.agendaService.celSelect)
        }
        else{
          if(this.agendaService.celSelect.horario !== 'manhã' && this.agendaService.celSelect.horario !== 'tarde'){
            //const resp = await this.buscaFinanceiro(this.agendaService.celSelect.id)
            if(this.dado.idCliente == this.agendaService.celSelect.idCliente){
              this.dado.data = new Date(this.agendaService.celSelect.dtAlt).toISOString();
              this.dado.valor = this.agendaService.celSelect.valor !== undefined && this.agendaService.celSelect.valor !== null ? this.agendaService.celSelect.valor : 0;
              this.dado.idFuncAlt = this.agendaService.celSelect.idFuncAlt
              const texto = 'Sessão alterada: ' + this.agendaService.celSelect.subtitulo + ' - ' + this.agendaService.celSelect.diaI
              this.dado.descricao = texto
              console.log(this.dado)
              //const ok = this.updateFin(this.dado)
            }
          }
          if (this.agendaService.celSelect.repeticao == 'Unica' && reptOriginal !== 'Unica'){
            this.agendaService.celSelect.id = 0
            console.log(this.agendaService.celSelect)
            this.salvaAgenda(this.agendaService.celSelect)
          }else{
            this.updateAgenda(this.agendaService.celSelect.id, this.agendaService.celSelect)
          }
        }
      }else{
        alert('Não há um profissional nesta sala para atender o Cliente.')
      }
    }
    }


    diaAnterior(dia: string):  string {
      const dataOriginalString = dia;
      const dataOriginal = new Date(dataOriginalString);

      // Subtrair um dia
      const dataAnterior = new Date(dataOriginal);
      dataAnterior.setDate(dataAnterior.getDate() - 1);

      // Formatando como string no formato 'YYYY-MM-DD'
      const dataFim = dataAnterior.toISOString();
      return dataFim
    }

    private dado: Financeiro = {
      id: 0,
      idCliente: 0,
      idFuncAlt: 0,
      nome: '',
      descricao: '',
      data: '',
      saldo: 0,
      valor: null,
      selecionada: false,
      recibo: '',
      refAgenda: '0',
    }
    async buscaFinanceiro(id: number){
        try{
            const resp = await this.financeiroService.getFinanceiroByAgenda(id)
            this.dado.id = (await resp).id
            this.dado.idCliente = (await resp).idCliente
            this.dado.idFuncAlt = (await resp).idFuncAlt
            this.dado.nome = (await resp).nome
            this.dado.descricao = (await resp).descricao

            this.dado.valor = (await resp).valor
            this.dado.selecionada = (await resp).selecionada
            this.dado.recibo = (await resp).recibo
            this.dado.refAgenda = (await resp).refAgenda
        }catch{}
        console.log(this.dado)
        return this.dado
    }

    async updateFin(info: Financeiro){
      info.data = info.data.substring(0, 10);
      try{
        const resp = await this.financeiroService.updateFinanceiro(info)
        console.log(resp)
        return resp
      }catch{return 'erro'}
      }
      async createFin(info: Financeiro){
        try{
          info.data = info.data.substring(0, 10);
          const resp = await this.financeiroService.createFinanceiro(info)
          console.log(resp)
          return resp
      }catch{return 'erro'}
    }

    teste(){
        this.validacoes()
      }


    async updateAgenda(id: number, texto: Agenda) {
      console.log(texto)
      try{
        const okCriaAgenda = await this.agendaService.UpdateAgenda(id, texto)
        if (texto.idCliente!== undefined && texto.subtitulo !== undefined){
          if (texto.idCliente !== 0){
            let area = '';
            for(let i of this.shared.ListaValores){
              if (texto.subtitulo == i.nome){
                area = i.nome;
              }
            }
            if (area !== ''){
              const respCliente = await this.clienteService.GetClientesById(texto.idCliente)
            let cliente: Cliente = respCliente.dados
            if (cliente.areaSession.includes(area) == false) {
            cliente.areaSession = cliente.areaSession + texto.subtitulo + ','
            const okCLiente = await this.clienteService.UpdateCliente(cliente)
            }
          }
        }
      }
        alert('Sessão atualizada!');
        this.delay(100);
        this.router.navigate(['/agenda']);
        this.agendaService.recarregar()
        return true
      }catch{
        alert('Ops!');
        return false}


    }

    async salvaAgenda(DadosEntrada: Agenda) {
       console.log(DadosEntrada)
      const okCriaAgenda = await this.agendaService.CreateAgenda(DadosEntrada)
      if (DadosEntrada.idCliente!== undefined && DadosEntrada.subtitulo !== undefined){
        if (DadosEntrada.idCliente !== 0 && DadosEntrada.status !== 'Sala'){
          let area = '';
          for(let i of this.shared.ListaValores){
            if (DadosEntrada.subtitulo == i.nome){
              area = i.nome;
            }
          }
          if (area !== ''){
            const respCliente = await this.clienteService.GetClientesById(DadosEntrada.idCliente)
          let cliente: Cliente = respCliente.dados
          if (cliente.areaSession.includes(area) == false) {
          cliente.areaSession = cliente.areaSession + DadosEntrada.subtitulo + ', '
          }
          const okCLiente = await this.clienteService.updateCliente(cliente)
        }
      }
    }
        if(DadosEntrada.status !== 'Sala'){
          const x = this.agendaService.celSelect.dtAlt !== undefined ? new Date(this.agendaService.celSelect.dtAlt) :new Date();
          this.dado.data = x.toISOString().split('T')[0]
          this.dado.valor = this.agendaService.celSelect.valor !== undefined && this.agendaService.celSelect.valor !== null ? this.agendaService.celSelect.valor : 0;
          this.dado.idFuncAlt = this.agendaService.celSelect.idFuncAlt !== undefined ? this.agendaService.celSelect.idFuncAlt : 0;
          const texto = 'Sessão alterada: ' + this.agendaService.celSelect.subtitulo + ' - ' + this.agendaService.celSelect.diaI
          this.dado.descricao = ''
          this.dado.id = 0
          this.dado.idCliente = this.agendaService.celSelect.idCliente !== undefined ? this.agendaService.celSelect.idCliente : 0;
          this.dado.nome = texto
          this.dado.recibo = ''
          this.dado.selecionada = false
          const dia = this.agendaService.celSelect.diaI !== undefined ? this.agendaService.celSelect.diaI : new Date().toISOString().split('T')[0]
          this.agendaService.success = false
          const busca = await this.agendaService.BuscarAgenda(dia)

          for (let i of this.agendaService.agendaG){
            if(i.sala == this.agendaService.celSelect.sala &&
              i.diaI == this.agendaService.celSelect.diaI &&
              i.horario == this.agendaService.celSelect.horario &&
              i.unidade == this.agendaService.celSelect.unidade
                ){
                  this.dado.refAgenda = i.id !== undefined ? i.id.toString() : '0';
                }
          }
          const ok = await this.createFin(this.dado)
        }
          alert('Sessão gravada!');
          this.delay(100);
          this.router.navigate(['/agenda']);
          this.agendaService.recarregar()
    }









    delay(time:number) {
      setTimeout(() => {

      }, time);
    }

}
