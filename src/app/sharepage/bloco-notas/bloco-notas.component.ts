import { Component, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { HeaderService } from '../../sharepage/navbar/header.service';
import { ProtclinComponent } from 'src/app/pages/protclin/protclin.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { Subscription } from 'rxjs';
import { TableData } from 'src/app/models/Tables/TableData';
import { Colaborador } from 'src/app/models/Colaboradors';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ProntuarioService } from 'src/app/services/prontuario/prontuario.service';
import { UserService } from 'src/app/services';
import { Prontuario } from 'src/app/models/Prontuarios';
import { SharedService } from 'src/app/shared/shared.service';
import { Valor } from 'src/app/models/Valores';
import { Router } from '@angular/router';
import { ProtadmComponent } from 'src/app/pages/protadm/protadm.component';

@Component({
  selector: 'app-bloco-notas',
  templateUrl: './bloco-notas.component.html',
  styleUrls: ['./bloco-notas.component.css']
})
export class BlocoNotasComponent implements OnInit {
  text: string = '';
  processedText: string = '';
  @Output() onSubmit = new EventEmitter<string>();

  //==================================================================
  @ViewChild(LoginComponent) login!: LoginComponent;
  @ViewChild('protadmRef') protadm!: ProtadmComponent;


  texto: string = '';
  linkA!: string;
  private subscription!: Subscription;
  nCliente!: number;
  Atual!: TableData;
  public Ficha:string = 'FICHA';
  public NomeCliente: string = '';
  public MostraInfo: boolean = true;
  public idFoto: string = '';
  public User!:Colaborador;
  public nUser!: number;
  public UserAll!: any;
  public rota: string = '';
//===================================================================

  highlightLinks() {
    // RegEx para detectar links ou arquivos
    let regex = /(http[s]?:\/\/[^\s]+)|(\.([a-zA-Z]{3,4}))$/;

    // Se o texto final corresponde a um link ou arquivo
    if(regex.test(this.text)) {
        this.text = this.text.replace(regex, '<span style="color: blue;">$&</span>');
    }

    this.processedText = this.text;
}

Enviar(){
  if(this.linkA!=='CONTROLE FINANCEIRO'){
  let texto = this.processedText;
  this.Insere(texto.toString());
  }else{
    this.Insere('CONTROLE FINANCEIRO');
  }


}

onKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLTextAreaElement;
  if (event.key === 'Enter' && target) {
      event.preventDefault();
      const startPosition = target.selectionStart;
      const endPosition = target.selectionEnd;
      const originalValue = target.value;
      target.value = originalValue.substring(0, startPosition)
                          + '\n'
                          + originalValue.substring(endPosition);
      target.selectionStart = target.selectionEnd = startPosition + 2;
  }
}
  constructor(private clienteService: ClienteService,
  private headerService: HeaderService,
  public shared: SharedService,
  private prontuarioService: ProntuarioService,
  private userService: UserService,
  private router: Router,
  ) { }

  ngOnInit() {
      this.subscription = this.clienteService.ClienteA$.subscribe(
        nameC => this.nCliente = nameC
      )
      this.subscription = this.userService.EquipeA$.subscribe(
        nameC => this.nUser = nameC
      )

      this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
        this.Atual = clienteAtual;
      });
      this.headerService.LinkA$.subscribe(link => {
        this.linkA = link;
        switch (this.linkA){
          case ('PRONTUÁRIO CLÍNICO'):
            this.rota = '/protclin'
            break;
          case ('PRONTUÁRIO ADMINISTRATIVO'):
            this.rota = '/protadm'
            break;
          case ('CONTROLE FINANCEIRO'):
            this.rota = '/controleFinaceiro'
            break;
          default:
            this.rota = '/inicio'
        }
      });

      console.log(this.shared.texto)
      this.processedText = this.shared.texto;
}

recarrega(data: Prontuario[]){
  console.log(data)
      data.map((i: any) => {
        i.clienteDesde !== null ? i.clienteDesde = new Date(i.clienteDesde!).toLocaleDateString('pt-BR') : '---'
        i.dtInclusao !== null ? i.dtInclusao = new Date(i.dtInclusao!).toLocaleDateString('pt-BR') : '---'
        i.dtNascim !== null ? i.dtNascim = new Date(i.dtNascim!).toLocaleDateString('pt-BR') : '---'
      })
      this.prontuarioService.prontuarioG = data
          this.prontuarioService.prontuarioG.sort((a, b) => (a.dtInsercao - b.dtInsercao));
          this.shared.setprotadmChange(true);
      alert('Registro gravado!');
      this.delay(300);
      this.shared.MostraInfo = !this.shared.MostraInfo;
  switch(this.rota){
    case ('/protadm'):
      this.router.navigate([this.rota]);
      break;
    case ('/protclin'):
      this.router.navigate([this.rota]);
      break;
  }
}


Insere (processedText: string) {
  if (processedText.length > 1) {
    let tipo: string = '';
    switch (this.linkA) {
      case "PRONTUÁRIO CLÍNICO":
        tipo = 'clínico'
        break;
      case "PRONTUÁRIO ADMINISTRATIVO":
        tipo = 'administrativo'
        break;
      case "CONTROLE FINANCEIRO":
        tipo = 'financeiro'
        break;
      default:
        tipo = ''
        break;
    }
    if (this.linkA == 'CONTROLE FINANCEIRO'){
      const novo: Valor = {
        id: this.shared.idTexto,
        nome: this.shared.texto,
        valor: parseFloat(this.shared.xvalor.toString()),
        data: new Date().toISOString().split('T')[0],
        selecionada: false,
      }
      if(this.shared.idTexto == 0){
        this.createValor(novo);
      }else{
        this.updateValor(novo);
      }
    }else{
      const texto: Prontuario = {
        id: this.shared.idTexto,
        idCliente: this.nCliente,
        idColab: this.nUser !== undefined ? this.nUser : 0,
        tipo: tipo,
        dtInsercao: new Date(),
        texto: processedText,
      };
      if(this.shared.idTexto == 0){
        this.createProntuario(texto);
      }else{
        this.updateProntuario(texto);
      }
    }


  }
}
carregaProtAdm(data: Prontuario[]){
  data.map((i: any) => {
    i.clienteDesde !== null ? i.clienteDesde = new Date(i.clienteDesde!).toLocaleDateString('pt-BR') : '---'
    i.dtInclusao !== null ? i.dtInclusao = new Date(i.dtInclusao!).toLocaleDateString('pt-BR') : '---'
    i.dtNascim !== null ? i.dtNascim = new Date(i.dtNascim!).toLocaleDateString('pt-BR') : '---'
  })
  this.prontuarioService.prontuarioG = data
      this.prontuarioService.prontuarioG.sort((a, b) => (a.dtInsercao - b.dtInsercao));
      this.shared.setprotadmChange(true);
}


createValor(novo: Valor) {
  const data = this.shared.createValor(novo);
      this.delay(300);
      alert('Registro gravado!');
      this.delay(300);
      this.router.navigate([this.rota]);

      this.shared.MostraInfo = false;
    }


updateValor(novo: Valor) {
  console.log(novo)
  try{
    const data = this.shared.updateValor(novo);
  }catch{
    console.error('ex.error');
  }

      this.delay(300);
      alert('Registro atualizado!');
      this.delay(300);

}
delay(time:number) {
  setTimeout(() => {

  }, time);
}
createProntuario(texto: Prontuario) {
  this.prontuarioService.CreateProntuario(texto).subscribe(
    (data) => {
      this.delay(300);
      this.recarrega(data.dados)
    },
    (error) => {
      console.error('Erro no upload', error);
    }
  );
}

updateProntuario(texto: Prontuario) {
  this.prontuarioService.UpdateProntuario(texto).subscribe(
    (data) => {

      // this.delay(300);
      // this.carregaProtAdm(data.dados);
      // alert('Registro atualizado!');
      // this.delay(300);
      this.recarrega(data.dados)
    },
    (error) => {
      console.error('Erro no upload', error);
    }
  );
}

formatarNumero(event: any) {
  // Remove caracteres não numéricos, exceto ponto decimal
  const valorFormatado = event.target.value.replace(/[^0-9.]/g, '');

  // Substitui vírgulas por ponto decimal
  const valorFinal = valorFormatado.replace(',', '.');

  // Atualiza o valor do input
  event.target.value = valorFinal;
}
}
