import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { UserService } from '../../services/user.service'; // Importe o UserService aqui
import { User } from '../../models/user'; // Importe a classe User aqui
import { ModalSenhaProvComponent } from './modal-senha-prov/modal-senha-prov.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public Perf: string='';
  public UsrLog: string  = '';
  public UsrLogA: any;
  public nUser!: number;
  private subscription!: Subscription;
  private userData!: User | null;
  private resposta: boolean | undefined = undefined;
  private UnserN: number = 0;
  public txtSalvar = "Entrar";


  constructor(private colab: ColaboradorService,
              private authService: AuthService,
              private router: Router,
              public userService: UserService,
              public dialog: MatDialog,

    ) {
      this.userService.EquipeA$.subscribe(resposta => {
        this.UnserN = resposta;
        // if(this.UnserN > 0){
        //   if(user.deslig == '' && user.valid !== 'True'){
        //     return true;
        //   }else{
        //     return false;
        //   }
        // }
      });

    }
    Validar(user: User | null){
      if (user !== null){

        if(user.prov == '' && user.valid == 'True'){  //if(user.deslig == '' && user.valid == 'True'){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }

    }

    visibilidadeSenha: boolean = false;

  toggleVisibilidadeSenha(): void {
    this.visibilidadeSenha = !this.visibilidadeSenha;
  }

  login(email: string, password: string) {
    this.txtSalvar = 'Aguarde...'
    this.userService.btnEntrar = true
    this.authService.authenticate(email, password).subscribe(
      (success) => {
        if (success) {
          const user = this.userService.getUserA().getValue();
          this.resposta = this.Validar(user)
          if (this.resposta == true){
            this.router.navigate(['/inicio']);
          }else{
            const dialogRef = this.dialog.open(ModalSenhaProvComponent, {
              disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
          });
          dialogRef.afterClosed().subscribe((result: any) => {

          });
          alert('OOoOOOooOOoPs! Não foi possível fazer o Login... :(');
          this.txtSalvar = 'Entrar'
          this.userService.btnEntrar = false
          }

        } else {
          alert('OOoOOOooOOoPs! Não foi possível fazer o Login... :(');
        }
      },
      (err) => {
        console.error(err);
        alert('OOoOOOooOOoPs! Não foi possível fazer o Login... :(');
          this.txtSalvar = 'Entrar'
          this.userService.btnEntrar = false
      }
    );
    this.txtSalvar = 'Login...'
    this.userService.btnEntrar = true;
  }



  async Dados1(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const verificarSucesso = () => {
        if (this.resposta !== undefined) {
          resolve(this.resposta);
        } else {
          setTimeout(() => {
            verificarSucesso();
          }, 100);
        }
      };
      verificarSucesso();
    });
  }

  openModal(): void {
    this.dialog.open(ModalSenhaProvComponent);
  }

  ngOnInit(): void {
    this.UsrLogA = this.userService.getUser();
    if(this.UsrLogA != null){
      this.nUser = this.UsrLogA.id;
      this.UsrLog = this.DefinirUsuario(this.UsrLogA)
    };
    this.userService.getUser().subscribe(
      data => {
        this.userData = data;
      },
      error => {
        console.error(error); // Trate qualquer erro que possa ocorrer durante a obtenção dos dados
      }
    );



  }


DefinirUsuario(n: User){
  if(n.perfil != null)
  {
    if(n.perfil?.toString() == '0') {
      this.Perf = 'Diretoria';
    }
    if(n.perfil?.toString() == '1') {
      this.Perf = 'Secretaria';
    }
    if(n.perfil?.toString() == '2') {
      this.Perf = 'Coordenação';
    }
    if(n.perfil?.toString() == '3') {
      this.Perf = 'Equipe Clínica';
    }
  }
  return n.name + ' *(' + this.Perf + ')'
}


//==================================================



alterarSenha(email: string){
  if(email == null || email == undefined || email == ''){
    this.userService.btnEntrar = true;
    alert('Você deve informar um e-mail válido.')
  }else{
    this.userService.btnEntrar = false;
    this.userService.troca = 'Aguarde...'
    this.salvar(email);
  }
}
async salvar(email: string){


const senha = this.gerarSenha();

const corpoX: string = "<p><strong><span style='color: blue; font-size: 24px;'> Caro usuário,</span></strong></p>"
 + "<p>Foi solicitada a alteração da sua senha no sistema <b>Clínica Casagrande. </b></p>"
 + "<p>Seu login é o e-mail <strong><span style='color: blue; font-size: 18px;'>"
 + email + ".</span></strong></p>"
 + "<p>Foi gerada uma nova senha <b>provisória</b>: <strong><span style='color: blue; font-size: 18px;'>"
 + senha + "</span></strong></p>"
 + "<p>Acesse o link do <a href='http://35.232.35.159'>aplicativo</a> e <b> utilize-a para atualizar seu login. </b>"
  + "Troque-a por uma senha que seja fácil para você decorar.</p>"
  + "<p>Caso você não tenha solicitado a alteração de senha, ou tenha se lembrado da senha anterior,</p>"
  + "basta utilizá-la normalmente, e desconsiderar este e-mail."


const variavel = email + '%' + corpoX + '%' + senha

 const resp1 = await this.userService.AlteraSenha(variavel).subscribe(async (data) => {
     const time1 = this.delay(500)

        alert('ALTERAÇÃO DE SENHA SOLICITADA!\nVocê receberá a senha provisória, no e-mail '
        + email + '.\nA senha deverá ser trocada no próximo login.\n'
        +'\nSomente após o usuário entrar no sistema e alterar a senha é que ele aparecerá como ATIVO no cadastro.')

        location.reload()
    }, error => {
     console.error('Erro no envio dos dados', error);
     this.userService.troca = 'Erro no envio dos dados'
     this.delay(2000);
     location.reload();
    });

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

