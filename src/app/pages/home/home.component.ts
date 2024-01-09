import { Subscription } from 'rxjs';
import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { HeaderService } from '../../sharepage/navbar/header.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { Perfil } from 'src/app/models/Perfils';
import { UserService } from 'src/app/services';
import { User } from 'src/app/models';
import { SharedService } from 'src/app/shared/shared.service';
import {Info} from '../../models/Infos'
import { DonoSala } from 'src/app/models/DonoSalas';
import { DonoSalaService } from 'src/app/services/donoSala/dono-sala.service';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';
import { FinanceiroService } from 'src/app/services/financeiro/financeiro.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textoAvisos: string = '';
  ctrlSalva: boolean = false;
  textoNiver: string = '';
  subscription!: Subscription;
  UsrAtual!: User
  public ps: Perfil[] = []
  public pAtual: any;
  buttons = [
    { text: 'FICHAS DE CLIENTES', param: 'parametro1', route: '/fichacliente'},
    { text: 'CADASTRO DA EQUIPE', param: 'parametro2', route: '/cadprof'},
    { text: 'AGENDA', param: 'parametro3', route: '/agenda' },
    { text: 'PRONTUÁRIO CLÍNICO', param: 'parametro4', route: '/protclin'},
    { text: 'PRONTUÁRIO ADMINISTRATIVO', param: 'parametro5', route: '/protadm'},
    { text: 'CONTROLE FINANCEIRO', param: 'parametro6', route: '/controleFinaceiro'}
  ];

  @ViewChild('avisosTextarea') avisosTextarea!: ElementRef;
  public textoPreDefinido: string = '';
  getCursorPosition(): number {
    return this.avisosTextarea.nativeElement.selectionStart;
  }
  constructor(private headerService: HeaderService,
    private clienteService: ClienteService,
    private perfilService: PerfilService,
    private userService: UserService,
    private colaboradorService: ColaboradorService,
    private shared: SharedService,
    private donoSala: DonoSalaService,
    private agenda: Agenda2Service,
    private financeiro: FinanceiroService
    ) {

      if(this.UsrAtual){
        for (let def in this.ps){
          if(this.UsrAtual.perfil?.toString() == '0'){

          }
        }
      }


    }




  ngOnInit(): void {

    this.userService.UsrA$.subscribe(Atual => {
      this.UsrAtual = Atual;
    });

    this.shared.GetInfoById(1).subscribe(data => {
      const dados = data.dados;
      this.textoAvisos = dados.nomeInfo !== undefined ? dados.nomeInfo : '';
    });

    this.Carregar();
    this.perfilService.GetPerfil().subscribe(data => {
      const dados = data.dados;
      dados.map((item) => {
        item.dir !== null ? item.dir = item.dir : item.dir = false;
        item.secr !== null ? item.secr = item.secr : item.secr = false;
        item.coord !== null ? item.coord = item.coord : item.coord = false;
      })
      this.ps = data.dados;
     this.ps.sort((a, b) => a.id - b.id);
     //console.log(this.ps)
     this.perfilService.perfils = this.ps;

    });



  }

async Carregar(){

  try {
        const r1 = await this.clienteService.BuscaClientes();
        this.clienteService.setClienteA(0);
        const r2 = await this.colaboradorService.GetCol();
        const dataAtual = new Date();
        const dia = dataAtual.getDate(); // Obtém o dia (1-31)
        const mes = dataAtual.getMonth() + 1; // Obtém o mês (0-11, então somamos 1 para obter 1-12)

        // Formata o dia e o mês com zero à esquerda se for menor que 10
        const diaFormatado = dia < 10 ? `0${dia}` : dia;
        const mesFormatado = mes < 10 ? `0${mes}` : mes;

        const hoje = `${diaFormatado}/${mesFormatado}`;


        for (let i of this.clienteService.clientesG){
          const dataNiv = i.dtNascim.split('/');
          const niver = dataNiv[0] + '/' + dataNiv[1];
          if (niver == hoje){
            const aIdade1 = this.converterParaDate(i.dtNascim);
            this.textoNiver = this.textoNiver + i.nome + ' (cliente, ' + this.calcularIdade(aIdade1) + ' anos)<br>';

          }
        }
        for (let i of this.colaboradorService.colaboradorsG){
          const nasc = i.dtNasc ? i.dtNasc : '00/00';
          const dataNiv = nasc.split('/');
          const niver = dataNiv[0] + '/' + dataNiv[1];
          if (niver == hoje){
            const aIdade1 = this.converterParaDate(nasc);
            this.textoNiver = this.textoNiver + i.nome + ' (equipe, ' + this.calcularIdade(aIdade1) + ' anos)<br>';

          }
        }
        if (this.textoNiver.length == 0){
          this.textoNiver = 'Sem aniversariantes por hoje...'
        }
        return true;


      }
      catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return false;
      }



}

  mostrarBotaoSalvar = false;

  saveAviso(){
    const UsrId = this.UsrAtual.userid !== undefined ? parseInt(this.UsrAtual.userid) : 0;
    const Aviso: Info = {
      id: 1,
      idFuncAlt: UsrId,
      nomeInfo: this.textoAvisos,
      subtitulo: '',
      dtInicio: new Date().toISOString().split('T')[0],
      dtFim: new Date().toISOString().split('T')[0],
      tipoInfo: "Aviso",
      destinat: "Todos",
    }
    this.shared.UpdateInfo(Aviso).subscribe(data => {
      //const dados = data.dados;
      //this.textoAvisos = dados.nomeInfo !== undefined ? dados.nomeInfo : '';
    });

      this.ctrlSalva == false;
      this.mostrarBotaoSalvar = false;
  }


  onEnter(event: KeyboardEvent): void {
    this.mostrarBotaoSalvar = true;
    this.ctrlSalva = true;
  }

  onBlur(): void {
    if(this.ctrlSalva == false){
      this.mostrarBotaoSalvar = false;
    }
  }

  addBullet(event: any) {
    const cursorPosition = this.getCursorPosition();
    const beforeCursor = this.textoAvisos.substring(0, cursorPosition).trim();
    const afterCursor = this.textoAvisos.substring(cursorPosition).trim();

    const linesBeforeCursor = beforeCursor.split('\n');


    if (linesBeforeCursor.length === 1 && !beforeCursor.startsWith('· ')) {
      // Caso especial: apenas a primeira linha está sendo alterada e ainda não tem um bullet
      this.textoAvisos = '· ' + beforeCursor + '\n' + afterCursor;
    } else {
      // Mantém o texto como está
      this.textoAvisos = beforeCursor + '\n' + afterCursor;
    }

      if (!linesBeforeCursor[linesBeforeCursor.length - 1].startsWith('· ')) {
        // Adiciona o bullet na última linha antes do cursor se ainda não tiver
        linesBeforeCursor[linesBeforeCursor.length - 1] = '· ' + linesBeforeCursor[linesBeforeCursor.length - 1];
      }

      this.textoAvisos = [...linesBeforeCursor, afterCursor].join('\n');

    // Posicione o cursor corretamente após a inserção
    setTimeout(() => {
      this.avisosTextarea.nativeElement.selectionStart = cursorPosition + 2;
      this.avisosTextarea.nativeElement.selectionEnd = cursorPosition + 2;
    });
  }



  atualizarHeader(texto: string): void {
    this.headerService.linkAtivo = texto;
  }


  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  calcularIdade(dataNascimento: Date): string {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();

    // Ajuste para caso o aniversário ainda não tenha ocorrido este ano
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    return idade.toString();
  }
}
