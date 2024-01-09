import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';


@Component({
  selector: 'app-modal-senha-prov',
  templateUrl: './modal-senha-prov.component.html',
  styleUrls: ['./modal-senha-prov.component.css']
})
export class ModalSenhaProvComponent {

  public loginAlt = {
    id: 0,
    novasenha: '',
  }

  async salvar(){
    this.dialogRef.close();
    this.router.navigate(['/login']);
    const id = this.loginAlt.id.toString();
    const pass = this.loginAlt.novasenha;

    console.log(id + ', ' + pass)


    this.colaboradorService.AlteraSenha(id, pass).subscribe((data) => {
      this.delay(300)
     alert('Registro atualizado!')
     console.log(data);
     this.dialogRef.close();
     location.reload()
   }, error => {
     console.error('Erro no upload', error);
   });
   this.router.navigate(['/login']);
  }



  delay(time:number) {
    setTimeout(() => {

    }, time);
  }

  constructor(
    public dialogRef: MatDialogRef<ModalSenhaProvComponent>,
    private colaboradorService: ColaboradorService,
    private userService: UserService,
    private router: Router,

  ) {
    this.userService.EquipeA$.subscribe(resposta => {
      this.loginAlt.id = resposta;
    });

  }
}
