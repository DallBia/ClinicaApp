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
  //@ViewChild(LoginComponent) login!: LoginComponent;
  //@ViewChild('protadmRef') protadm!: ProtadmComponent;


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
      console.log('Em Bloco de Notas: ' + this.shared.texto)
      this.processedText = this.shared.texto;
}


Insere (processedText: string) {
  if (processedText.length > 1) {

    if (this.prontuarioService.tipo =='financeiro'){
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
      let User: number = 0;
      const stringUsr = window.sessionStorage.getItem('nUsr')
      if (stringUsr !== null && stringUsr !== undefined){
        try{ User = parseInt(stringUsr);}
        catch{ User = 0}
      }
      const texto: Prontuario = {
        id: this.shared.idTexto,
        idCliente: this.prontuarioService.nCliente,
        idColab: User,
        tipo: this.prontuarioService.tipo,
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

  Enviar(){
    this.prontuarioService.vSalva = false
    if(this.prontuarioService.tipo!=='financeiro'){
      let texto = this.processedText;
      this.Insere(texto.toString());
    }else{
      this.Insere('CONTROLE FINANCEIRO');
    }
    this.prontuarioService.vSalva = true

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
      this.shared.MostraInfo = false;
      alert('Informação inserida!')
      this.prontuarioService.iniciar();
    },
    (error) => {
      console.error('Erro no upload', error);
    }
  );
}

updateProntuario(texto: Prontuario) {
  this.prontuarioService.UpdateProntuario(texto).subscribe(
    (data) => {
      this.delay(300);
      this.shared.MostraInfo = false;
      alert('Informação inserida!')
      this.prontuarioService.iniciar();
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
