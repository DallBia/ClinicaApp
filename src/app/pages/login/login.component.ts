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


  alterarSenha(email: string){
    if(email == null || email == undefined || email == ''){
      this.userService.btnEntrar = true;





    }else{
      console.log('o email é válido')
    }
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
}

