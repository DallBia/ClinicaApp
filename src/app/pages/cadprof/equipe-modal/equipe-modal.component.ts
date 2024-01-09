import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Colaborador } from 'src/app/models/Colaboradors';
import { UserService } from 'src/app/services';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';

@Component({
  selector: 'app-equipe-modal',
  templateUrl: './equipe-modal.component.html',
  styleUrls: ['./equipe-modal.component.css']
})
export class EquipeModalComponent {
private id: number = 0;

formulario: any = {
  nomeEquipe: '',

    nome: '',
    dtNasc:  '',
    rg:  '',
    cpf:  '',
    endereco:  '',
    telFixo:  '',
    celular:  '',
    email:  '',
    dtAdmis:  '',
    dtDeslig:  '',
    idPerfil:  '',
    ativo:  '',
    areaSession:  '',
    senhaHash:  '',
}

  public btn = false;
  public txt = 'SALVAR'
  constructor(
    public dialogRef: MatDialogRef<EquipeModalComponent>,
    private colaboradorService: ColaboradorService,
    private userService: UserService,

  ) {}

  ngOnInit(){
    this.userService.alertas = true;
    console.log(this.userService.alertas)
  }

  async salvar(){
    this.txt = 'Aguarde...'
    this.btn = true;
  const nomeX = this.formulario.nome;
  const destinatarioX: string = this.formulario.email;
  const assuntoX: string = 'Cadastro de novo funcionário';
  const perf = this.formulario.idPerfil;
  const senha = this.gerarSenha();
  const celX = this.formulario.celular;
  const corpoX: string = "<p><strong><span style='color: blue; font-size: 24px;'> Olá, "
   + this.formulario.nome + "!</span></strong></p>"
   + "<p>Você acaba de ser cadastrado como funcionário da <b>Clínica Casagrande. </b></p>"
   + "<p>Seu login é o e-mail <strong><span style='color: blue; font-size: 18px;'>"
   + this.formulario.email + ".</span></strong></p>"
   + "<p>Sua senha <b>provisória</b> é <strong><span style='color: blue; font-size: 18px;'>"
   + senha + "</span></strong></p>"
   + "<p>Acesse o link do <a href='http://35.232.35.159'>aplicativo</a> e <b>altere a senha. </b>"
    + "Coloque uma senha que seja fácil para você decorar.</p>"
    + "<p>Para sua comodidade, salve o link na sua guia de marcadores favoritos.</p>"
    + "Depois, vá na guia <b>Cadastro de Equipe</b>, selecione seu nome através do filtro e "
    + "complete as informações do seu cadastro."
  //alert (corpo);
  let V: boolean = true;
  if(nomeX == null || nomeX == undefined){
    V = false;
  }
  if(perf == null || perf == undefined){
    V = false;
  }
  if(destinatarioX == null || destinatarioX == undefined){
    V = false;
  }
  let nperf: number;
  switch (perf){
    case 'Diretoria':
      nperf = 0;
      break;
    case 'Secretaria':
      nperf = 1;
      break;
    case 'Coordenação':
      nperf = 2;
      break;
      case 'Equipe Clínica':
        nperf = 3;
        break;
    default:
      nperf = 3;
  }
  if (V == true){
    const novoUs: Colaborador = {
      id: 0,
      nome: nomeX,
      dtNasc: '1900-01-01',
      rg: '(preencha)',
      cpf: '(preencha)',
      endereco:  '(preencha)',
      telFixo: '(preencha)',
      celular: celX,
      email:  destinatarioX,
      dtAdmis: new Date().toISOString().split('T')[0],
      dtDeslig:  '1900-01-01',
      idPerfil: nperf,
      ativo: false,
      areaSession: '(nenhuma)',
      senhaHash: senha,
    }
    // const Mail = {
    //   destinatario: destinatarioX,
    //   assunto: assuntoX,
    //   corpo: corpoX,
    // }
    // console.log(novoUs)
    // console.log(Mail)
   const resp1 = await this.colaboradorService.CreateEquipe(novoUs).subscribe(async (data) => {
       const time1 = await this.delay(500)
          const dados = this.colaboradorService.GetCol();
          console.log(dados)
          alert('CADASTRO ENVIADO!\nO usuário '
          + this.formulario.nome + ' receberá a senha provisória, no e-mail '
          + this.formulario.email + '.\nA senha deverá ser trocada no primeiro login.\n'
          +'\nSomente após o usuário entrar no sistema e alterar a senha é que ele aparecerá como ATIVO no cadastro.')
          this.txt = 'Salvar'
          this.btn = true
          location.reload()
      }, error => {
       console.error('Erro no salvamento do usuário', error);
       this.txt = 'Salvar'
       this.btn = true
      });


  }
  else{
    alert('Há informações em branco.')
    this.txt = 'Salvar'
    this.btn = true
  }

}






delay(time:number): boolean {
  setTimeout(() => {

  }, time);
  return true;
}


reDatas(dataO: string){

  const [dia, mes, ano] = dataO.split('/');
  if(dia.length == 2){
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const dataFormatada = data.toISOString().split('T')[0];
     return (dataFormatada);
  }
  else{
     return (dataO);
  }

}

  fechar() {
    this.dialogRef.close();
  }

  gerarSenha() {
    const caracteresMaiusculos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const caracteresMinusculos = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const caracteresEspeciais = '!@#$%^&*()-_+=<>?';

    const todosCaracteres = caracteresMaiusculos + caracteresMinusculos + numeros + caracteresEspeciais;

    let senha = '';
    senha += caracteresMaiusculos[Math.floor(Math.random() * caracteresMaiusculos.length)];
    senha += caracteresMinusculos[Math.floor(Math.random() * caracteresMinusculos.length)];
    senha += numeros[Math.floor(Math.random() * numeros.length)];
    senha += caracteresEspeciais[Math.floor(Math.random() * caracteresEspeciais.length)];

    for (let i = 4; i < 8; i++) {
        senha += todosCaracteres[Math.floor(Math.random() * todosCaracteres.length)];
    }

    // Embaralhe a senha para garantir aleatoriedade
    senha = senha.split('').sort(() => Math.random() - 0.5).join('');

    return senha;
}
}
