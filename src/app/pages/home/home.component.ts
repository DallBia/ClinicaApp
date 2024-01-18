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
import { Tipo } from 'src/app/models/Tipo';


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
    ) {

    }




  ngOnInit(): void {

    this.userService.UsrA$.subscribe(Atual => {
      this.UsrAtual = Atual;
    });

    this.shared.GetInfoById(1).subscribe(data => {
      console.log('Infos recebidas:')
     console.log(data.dados)
      const dados = data.dados;
     this.textoAvisos = dados.nomeInfo !== undefined ? dados.nomeInfo : '';
    });

    window.sessionStorage.setItem('nCli','0')
    window.sessionStorage.setItem('nCol','0')
    this.Carregar();
    const r = this.perfilService.guardaPerfil();

  }





async Carregar(){
this.userService.btnEntrar = false;
  let Cli: Tipo[] | undefined = undefined;
        this.clienteService.setClienteA(0);
        let idade = 0
        try {
         const lCli = await this.clienteService.GetClientesByAgenda('home');
         Cli = lCli.dados;
        }
        catch (error) {
          console.error('Erro ao buscar clientes.'); //console.error('Erro ao buscar clientes:', error);
        }
        console.log(Cli)
        if (Cli !== undefined){
          for (let i of Cli){
            const pessoa = i.nome.split('%')
            let data = new Date(pessoa[1]).toISOString().split('T')[0];
            const dia1 = new Date(pessoa[1]).getDate();
            const mes1 = new Date(pessoa[1]).getMonth() + 1;
            const dia2 = new Date().getDate();
            const mes2 = new Date().getMonth() + 1;
            if (dia1 ==dia2 && mes1 == mes2){
                idade = this.shared.idades(pessoa[1])
                this.textoNiver = this.textoNiver + pessoa[0] + ' (cliente, ' + idade + ' anos)<br>';
            }
          }
        }

        if (this.textoNiver.length == 0){
          this.textoNiver = 'Sem aniversariantes por hoje...'
        }


  }

  mostrarBotaoSalvar = false;

  saveAviso(){
    if (this.perfilService.validaPerfil(0,18) == false){
      alert('Você não tem permissão para alterar avisos.')
    }else{
      const UsrId = this.UsrAtual.userid !== undefined ? parseInt(this.UsrAtual.userid) : 0;
      const Aviso: Info = {
        id: 1,
        idFuncAlt: UsrId,
        nomeInfo: this.textoAvisos,
        subtitulo: '',
        dtInicio: new Date().toISOString(),
        dtFim: new Date().toISOString(),
        tipoInfo: "Aviso",
        destinat: "Todos",
      }
      this.shared.UpdateInfo(Aviso).subscribe(data => {
        const dados = data.dados;
        console.log(dados)
        alert(data.mensagem);

      });

        this.ctrlSalva == false;
        this.mostrarBotaoSalvar = false;
    }
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

}
