import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Perfil } from 'src/app/models/Perfils';
import { PerfilTabComponent } from 'src/app/sharepage/perfil-tab/perfil-tab.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent implements OnInit{
  public Ajuda:string = 'Passe o mouse por cima da linha para ter uma descrição mais detalhada.';
  @ViewChild(PerfilTabComponent) formPerf!: PerfilTabComponent;

  constructor (private perfilService: PerfilService,
    private router: Router,
    ){}


  ngOnInit(){

    if(this.perfilService.validaPerfil(0,16) == false){
      alert('Você não tem autorização para acessar esta página')
      this.router.navigate(['/inicio']);
    }

    this.perfilService.Ajuda$.subscribe((novoValor) => {
      this.Ajuda = novoValor;
    });

    this.carregar()

  }

carregar(){
  const r = this.trazerPerfil();
  console.log(window.sessionStorage.getItem('nPrf'))
  console.log(window.sessionStorage.getItem('nUsr'))
  for (let i = 1; i < 19; i++) {
    const nome = 'Perfil' + i.toString();
    console.log('Em ' + nome + ': ' + window.sessionStorage.getItem(nome))
  }
}

  async trazerPerfil(){
    try{
      const r = await this.perfilService.guardaPerfil();
      return true
    }catch{
      return false
    }
  }

    async Salvar(){
      const nPerfil = this.formPerf.perfil;
      for (let i of nPerfil){
        this.perfilService.UpdatePerfil(i).subscribe((data) => {
        this.delay(100)

        }, error => {
          console.error('Erro no upload', error);
        });
          const r = await this.perfilService.guardaPerfil();
      }
      alert('Registro atualizado!')
      location.reload()
    }

    Cancelar(){
      location.reload()
    }
    delay(time:number) {
      setTimeout(() => {

      }, time);
    }
}
