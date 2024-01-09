import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Perfil } from 'src/app/models/Perfils';
import { PerfilTabComponent } from 'src/app/sharepage/perfil-tab/perfil-tab.component';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent implements OnInit{
  public Ajuda:string = 'Passe o mouse por cima da linha para ter uma descrição mais detalhada.';
  @ViewChild(PerfilTabComponent) formPerf!: PerfilTabComponent;

  constructor (private perfilService: PerfilService){}


  ngOnInit(){
    this.perfilService.Ajuda$.subscribe((novoValor) => {
      this.Ajuda = novoValor;
    });
  }

    Salvar(){
      const nPerfil = this.formPerf.perfil;
      for (let i of nPerfil){
        this.perfilService.UpdatePerfil(i).subscribe((data) => {
        this.delay(100)
        console.log(i.id)
     }, error => {
       console.error('Erro no upload', error);
     });
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
