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


@Component({
  selector: 'app-agenda-menu',
  templateUrl: './agenda-menu.component.html',
  styleUrls: ['./agenda-menu.component.css']
})
export class AgendaMenuComponent implements OnInit {

    constructor(
      public agendaService: Agenda2Service,
      public foto: FileService,
      public shared: SharedService,
      public userService: UserService,
      public financeiroService: FinanceiroService,
      public dialog: MatDialog,
      private router: Router,

    ){}

      public fotografia: any = false
      public subscription: Subscription | undefined;

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
      let r: any = 0;
      console.log(this.agendaService.ListaValores)
      this.agendaService.agendaNsessoes = n
      if(n >0){
        let id00 = new Date()
        let id01 = id00.toISOString()
        id01 = id01.replace(/\D/g, '')
        this.agendaService.numReserva = id01



        const vlr = this.agendaService.celSelect.valor !== undefined ? this.agendaService.celSelect.valor : 0;
        const valorSess: number = this.agendaService.celSelect.valor !== undefined ? this.agendaService.celSelect.valor / n : 0;
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
        this.agendaService.numReserva = tipo
        const parm = 'id%' + this.agendaService.numReserva.toString()
        r = this.BuscaAg(parm);
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
      if (this.agendaService.celSelect.valor !== undefined){
        if(this.agendaService.celSelect.valor < 0){
        this.agendaService.celSelect.valor = 0;
        }
      }
    }


    setStatus(status: string){
      if(status == 'Bloqueado'){
        let valSt = false
        const StatAnt = this.agendaService.cellA.status
        if(StatAnt == '' || StatAnt == 'Vago'){
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



    async salvaSessao(){
      //let diff = this.saoIguais(this.agendaService.celSelect, this.agendaService.cellA)
      let diff = true
      if (diff == true){
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

        let sessao = '';
        let dataFim = '';
        switch (this.agendaService.celSelect.repeticao){
          case 'Sessão única':
            sessao = 'Unica';
            this.agendaService.celSelect.configRept = "X";
            dataFim = this.agendaService.dia
            break;
          case 'Diária':
            sessao = 'Diaria';
            this.agendaService.celSelect.configRept = "D%" + this.agendaService.dia.substring(0,2) + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            break;
          case 'Semanal':
            sessao = 'Semanal';
            this.agendaService.celSelect.configRept = "S%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            break;
          case 'Quinzenal':
            sessao = 'Quinzenal';
            this.agendaService.celSelect.configRept = "Q%" + this.agendaService.diaSemana + '%' + this.agendaService.parImpar
            dataFim = '2100-01-01'
            break;
          case 'Mensal':
            sessao = 'Mensal';
            this.agendaService.celSelect.configRept = "M%" + this.agendaService.diaSemana + '%' + this.agendaService.dia.substring(0,2)
            dataFim = '2100-01-01'
            break;
          case 'Cancelar Repetição':
            sessao = 'Cancelar';
            dataFim = this.diaAnterior(this.agendaService.dia)
            break;
          default:
            sessao = 'Unica';
            dataFim = this.agendaService.dia
        }


        let texto = '';
        const dataAtual = new Date();
        const horas = dataAtual.getHours();
        const minutos = dataAtual.getMinutes();

        const horaFormatada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        const Usr = this.userService.getUserA().getValue();

        if (this.agendaService.cellA.status == ''|| this.agendaService.cellA.status == 'Vago'){
          texto = 'Agendamento de ' + this.agendaService.celSelect.subtitulo + '. ';
          this.agendaService.celSelect.status == 'Pendente';
        }
        if(this.agendaService.celSelect.status == 'Vago'){
            texto = 'Sessão anterior Excluída.';
            this.agendaService.celSelect.repeticao = 'Cancelar';
            this.agendaService.celSelect.subtitulo ='';
            this.agendaService.celSelect.nome = '';
            this.agendaService.celSelect.idCliente = 0;
            this.agendaService.celSelect.subtitulo = '';
            this.agendaService.celSelect.obs = '';
            this.agendaService.celSelect.valor = -1000009;
          }else{
            if(this.agendaService.cellA.repeticao !== this.agendaService.celSelect.repeticao){
              texto += 'Repetição alterada: de ' + this.agendaService.cellA.repeticao + ' para ' + this.agendaService.celSelect.repeticao + '. '
            }
            if(this.agendaService.cellA.valor !== this.agendaService.celSelect.valor){
              texto += 'Valor alterado: de ' + this.agendaService.cellA.valor + ' para ' + this.agendaService.celSelect.valor + '. '
            }
            if(this.agendaService.cellA.nome !== this.agendaService.celSelect.nome){
              texto += 'Cliente alterado: de ' + this.agendaService.cellA.nome + ' para ' + this.agendaService.celSelect.nome + '. '
            }
            if(this.agendaService.cellA.status !== this.agendaService.celSelect.status){
              texto += 'Novo Status: ' + this.agendaService.celSelect.status + '. '
            }
          }

        this.agendaService.celSelect.repeticao = sessao;
        if (this.agendaService.celSelect.repeticao == '' || this.agendaService.celSelect.repeticao == undefined){
          this.agendaService.celSelect.repeticao = 'Unica'
        }
        let Histmp = '%' + new Date().toLocaleDateString('pt-BR') + ' - ' +  horaFormatada + ':\n' + texto  + '\npor: ' + Usr?.name + '\nꟷꚚꟷ\n';
        this.agendaService.celSelect.historico += Histmp;
        const usrId = Usr?.userid !== undefined ? parseInt(Usr?.userid, 10) : 0;
        this.agendaService.celSelect.idFuncAlt = usrId
        this.agendaService.celSelect.diaI = this.agendaService.dia;
        this.agendaService.celSelect.diaF = dataFim;
        this.agendaService.celSelect.unidade = this.agendaService.un;
        this.agendaService.celSelect.horario = this.agendaService.horario;
        this.agendaService.celSelect.sala = this.agendaService.sala;
        this.agendaService.celSelect.dtAlt = new Date().toISOString();
        this.agendaService.celSelect.status = this.agendaService.celSelect.status == '' ? 'Pendente' : this.agendaService.celSelect.status
        if (this.agendaService.celSelect.subtitulo !== undefined){
          this.agendaService.celSelect.subtitulo = this.agendaService.celSelect.subtitulo.length == 0 ? '' : this.agendaService.celSelect.subtitulo
        }else{
          this.agendaService.celSelect.subtitulo = '';
        }

        if(this.agendaService.celSelect.id == 0 || this.agendaService.celSelect.id == undefined){
          this.salvaAgenda(this.agendaService.celSelect)
        }
        else{
          const resp = await this.buscaFinanceiro(this.agendaService.celSelect.id)

          if(this.dado.idCliente == this.agendaService.celSelect.idCliente){
            this.dado.data = this.agendaService.celSelect.dtAlt
            this.dado.valor = this.agendaService.celSelect.valor !== undefined ? this.agendaService.celSelect.valor : 0;
            this.dado.idFuncAlt = this.agendaService.celSelect.idFuncAlt
            const texto = 'Sessão alterada: ' + this.agendaService.celSelect.subtitulo + ' - ' + this.agendaService.celSelect.diaI
            this.dado.descricao = texto
            console.log(this.dado)
            const ok = this.updateFin(this.dado)
          }
          this.updateAgenda(this.agendaService.celSelect.id, this.agendaService.celSelect)
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
      const dataFim = dataAnterior.toISOString().split('T')[0];
      return dataFim
    }

    private dado: Financeiro = {
      id: 0,
      idCliente: 0,
      idFuncAlt: 0,
      nome: '',
      descricao: '',
      data: '',
      valor: -1000009,
      selecionada: false,
      recibo: '',
      refAgenda: 0,
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

      }


    async updateAgenda(id: number, texto: Agenda) {
      console.log(texto)
      try{
        const okCriaAgenda = await this.agendaService.UpdateAgenda(id, texto)
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

          const x = this.agendaService.celSelect.dtAlt !== undefined ? new Date(this.agendaService.celSelect.dtAlt) :new Date();
          this.dado.data = x.toISOString().split('T')[0]
          this.dado.valor = this.agendaService.celSelect.valor !== undefined ? this.agendaService.celSelect.valor : 0;
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
                  this.dado.refAgenda = i.id !== undefined ? i.id : 0;
                }
          }
          const ok = await this.createFin(this.dado)
          alert('Sessão gravada!');
          this.delay(100);
          this.router.navigate(['/agenda']);
          this.agendaService.recarregar()
    }


    saoIguais(agenda1: Agenda, agenda2: Agenda): boolean {

      if (!agenda1 || !agenda2) {
        return false;
      }

      const chavesAgenda1 = Object.keys(agenda1);
      const chavesAgenda2 = Object.keys(agenda2);

      if (chavesAgenda1.length !== chavesAgenda2.length) {
        return false;
      }
      const n = chavesAgenda1.length
      for (let i = 0; i < n; i++) {
        if (chavesAgenda1[i] !== chavesAgenda2[i]) {
          return false;
        }
      }
      return true;
    }







    delay(time:number) {
      setTimeout(() => {

      }, time);
    }

}
