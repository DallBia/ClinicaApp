import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Perfil } from 'src/app/models/Perfils';

@Component({
  selector: 'app-perfil-tab',
  templateUrl: './perfil-tab.component.html',
  styleUrls: ['./perfil-tab.component.css']
})
export class PerfilTabComponent implements OnInit{
  public perfil: Perfil[] = [];
  public nLin: Perfil[] = [];
  public Atual!: Perfil[];


    constructor(private perfilService: PerfilService) {}

  ngOnInit(): void {
    this.perfilService.GetPerfil().subscribe(data => {
      const dados = data.dados;
      dados.map((item) => {
        item.dir !== null ? item.dir = item.dir : item.dir = false;
        item.secr !== null ? item.secr = item.secr : item.secr = false;
        item.coord !== null ? item.coord = item.coord : item.coord = false;
      })
      this.perfilService.perfils = data.dados;
      this.perfilService.perfils.sort((a, b) => a.id - b.id);
      this.perfil = this.perfilService.perfils;
    });

  }
  exibirHelp(helpTexto: string) {

      this.perfilService.setAjuda(helpTexto);

  }

}
