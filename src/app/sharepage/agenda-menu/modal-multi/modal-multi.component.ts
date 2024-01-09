
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Agenda } from 'src/app/models/Agendas';
import { UserService } from 'src/app/services';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModalConfirComponent } from 'src/app/sharepage/modal-confir/modal-confir.component';


@Component({
  selector: 'app-modal-multi',
  templateUrl: './modal-multi.component.html',
  styleUrls: ['./modal-multi.component.css']
})
export class ModalMultiComponent implements OnInit, OnDestroy{

  public informacao = '';
  public ListaAgenda: any = [];
  public idPr = 0;

  public valorStr: string = '';

  constructor(
    public agenda: Agenda2Service,
    private userService: UserService,
    public dialog: MatDialog,
    public shared: SharedService,
    public dialogRef: MatDialogRef<ModalMultiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnDestroy(): void {
    this.agenda.ListaAgenda = []
  }

  ngOnInit() {
    this.ListaAgenda= []
      this.ListaAgenda = this.agenda.ListaAgenda;
      const n = this.agenda.agendaNsessoes;
  }





  ajustaValor(i: number){

  }

  exemploChamadaApi(): void {


    // Se desejar, você pode armazenar a inscrição para mais tarde cancelá-la (por exemplo, ngOnDestroy)
    // this.subscriptions.push(subscription);
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }



buscaData(n?: number){
  const x = n !== undefined ? n : 0
  for (let i of this.agenda.ListaEquipe){
    if (i.nome == this.ListaAgenda[x].profis){
      this.idPr = i.id
      this.ListaAgenda[x].status = this.idPr
    }
  }
this.busca(n)
}

buscaDia(n?: number){
  this.busca(n)
}
buscaHora(n?: number){
  this.busca(n)
}
buscaStatus(n?: number){
  this.busca(n)
}

async busca(n?: number){
  const x = n !== undefined ? n : 0
  let idPr = 0;
  console.log(this.ListaAgenda[x])

  for (let i of this.agenda.ListaEquipe){
    if (i.nome == this.ListaAgenda[x].profis){
      idPr = i.id
    }
  }
  if (this.ListaAgenda[x].profis !== ''
        && this.ListaAgenda[x].dia !== ''
        && this.ListaAgenda[x].hora !== ''
        ){

        let rept = 'A%' + this.agenda.calcDiaSemana(this.ListaAgenda[x].dia);
        rept = rept + '%' + this.agenda.calcSemanaSimNao(this.ListaAgenda[x].dia);

        const origem: Agenda = {
          id: 1,
          idCliente: idPr,
          nome: this.ListaAgenda[x].profis,
          idFuncAlt: idPr,
          dtAlt: new Date().toISOString(),
          horario: 'manhã',
          sala: 0,
          unidade: 0,
          diaI: this.ListaAgenda[x].dia,
          diaF: this.ListaAgenda[x].dia,
          repeticao: 'Unica',
          subtitulo: '',
          status: 'Vago',
          historico: '',
          obs: '',
          valor: 0,
          configRept: rept,
          multi: this.agenda.numReserva,
        }
        console.log(origem)
        const data = await this.agenda.getAgendaMulti(origem)
        const dados = data.dados

        console.log(dados)
        const mensagem = data.mensagem
        console.log('Mensagem: ' + mensagem)
        if (mensagem == 'Encontrado.'){
          const origem2: Agenda = {
            id: 0,
            idCliente: 0,
            nome: '',
            idFuncAlt: 0,
            dtAlt: new Date().toISOString(),
            horario: this.ListaAgenda[x].hora,
            sala: dados.sala,
            unidade: dados.unidade,
            diaI: this.ListaAgenda[x].dia,
            diaF: this.ListaAgenda[x].dia,
            repeticao: 'Unica',
            subtitulo: '',
            status: 'Vago',
            historico: '',
            profis: this.ListaAgenda[x].profis,
            obs: '',
            valor: 0,
            multi: this.agenda.numReserva,
            configRept: '',
          }
          console.log(origem2)
          const data2 = await this.agenda.getAgendaMulti(origem2)
          const dados2 = data2.dados
          console.log(dados2)
          console.log('Mensagem: ' + data2.mensagem)
          if (data2.mensagem == 'Disponível.'){
            this.ListaAgenda[x].status = '●'
            n = this.ListaAgenda[x].id
            if(n !== undefined){
              const nn = n + 1;
              let nId: number = 0;
              for(let h of this.agenda.ListaCLientes){
                if (this.agenda.celSelect.nome == h.nome){
                  nId = h.id;
                }
              }
              const Usr = this.userService.getUserA().getValue();
              const usrId = Usr?.userid !== undefined ? parseInt(Usr?.userid, 10) : 0;

              this.agenda.agendaMulti[n] = {
                id: nn,
                idCliente: nId,
                nome: this.agenda.celSelect.nome,
                idFuncAlt: usrId,
                dtAlt: new Date().toISOString(),
                horario: this.ListaAgenda[x].hora,
                sala: dados.sala,
                unidade: dados.unidade,
                diaI: this.ListaAgenda[x].dia,
                diaF: this.ListaAgenda[x].dia,
                repeticao: 'Unica',
                subtitulo: 'ო(' + nn + ' de ' + this.agenda.agendaNsessoes + ') ' + this.agenda.celSelect.subtitulo,
                status: '',
                profis: this.ListaAgenda[x].profis,
                historico: this.agenda.numReserva + ' (' + nn + ' de ' + this.agenda.agendaNsessoes + ')',
                obs: '',
                multi: this.agenda.numReserva,
                valor: nn == 1 ? this.agenda.celSelect.valor : 0,
                configRept: 'X',
              }
              console.log(this.agenda.agendaMulti[n])
            }

          }else{
            this.ListaAgenda[x].status = '○'
          }
        }else{
          this.ListaAgenda[x].status = '○'
        }
      }

}

async onReserveClick(){
  console.log('Serão feitos os seguintes agendamentos:')
  console.log(this.agenda.agendaMulti)
  for (let i of this.agenda.agendaMulti){
    i.status = 'Reservado';
    const n =  i.id !== undefined ? i.id - 1 : 0;
    i.id = 0;
    this.informacao = 'Gravando dados... sessão ' + this.ListaAgenda[n].sessao.toString();
    const okCriaAgenda = await this.agenda.CreateAgenda(i);
    console.log(okCriaAgenda)
    while (okCriaAgenda == undefined){
      this.delay(500)
      console.log('Aguardando...')
    }
  }
  this.informacao = '';
  this.agenda.recarregar();
  this.onCloseClick();
}


onCancelClick(): void{
  this.shared.textoModal = 'Selecione a opção desejada:'
  this.shared.tituloModal = 'Confirme o cancelamento das reservas'
  this.shared.nbotoes = ['Apenas as reservas de ' + this.agenda.numReserva, 'Todas as reservas de ' + this.agenda.celSelect.nome]
  const dialogRefConfirm = this.dialog.open(ModalConfirComponent, {

  });
  dialogRefConfirm.afterClosed().subscribe(result => {
      //alert('A opção escolhida foi: '+ this.shared.respostaModal)
      this.Cancela();
  });

};

async Cancela(){
  this.informacao = 'Aguarde...';
  let param = '';
  let id = 0;

  switch (this.shared.respostaModal[0]){
    case ('A'):
      id = 2;
      param = this.agenda.numReserva
    break;
    case ('T'):
      id = 1;
      param = this.agenda.celSelect.nome !== undefined ? this.agenda.celSelect.nome : '';
    break;
    default:
      id = 0;
      param = this.agenda.celSelect.nome !== undefined ? this.agenda.numReserva : '';
    break;
  }

    this.agenda.MultiAgenda(id, param).subscribe((data) => {
      console.log(data.mensagem)
      this.delay(300)

      this.onCloseClick();
      alert(data.mensagem);
      this.agenda.recarregar()
    }, error => {
      console.error('Erro no upload', error);
    });
}


delay(time:number) {
  setTimeout(() => {

  }, time);
}

onSaveClick(){
  this.shared.respostaModal = 'Marcar'
  this.Cancela();
}

}

