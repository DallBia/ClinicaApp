import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-tab-valores',
  templateUrl: './tab-valores.component.html',
  styleUrls: ['./tab-valores.component.css']
})
export class TabValoresComponent {

  /**
   *
   */
  constructor(
    public shared: SharedService,

  ) {


  }
  Selec(l: any, $event: any, texto: string | undefined, valor: number | undefined){
    let numero = parseInt(l.nome, 10);
      if (isNaN(numero)) {
        numero = 0;
    }

    this.shared.ListaValores.forEach(l => l.selecionada = false);// Desmarcar todas as outras linhas
    l.selecionada = true;

    this.shared.MostraInfo = !this.shared.MostraInfo;
    if(this.shared.MostraInfo == false){
      this.shared.texto = '';
      this.shared.idTexto = 0;
    }else{
      this.shared.idTexto = l.id;
      this.shared.texto = texto !== undefined ? texto : '';
      this.shared.xvalor = valor !== undefined ? valor : 0;


      }
  }



}
