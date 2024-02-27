import { Component } from '@angular/core';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { FinanceiroService } from 'src/app/services/financeiro/financeiro.service';
import { FormsModule } from '@angular/forms';
import { fi } from 'date-fns/locale';

@Component({
  selector: 'app-tab-fin',
  templateUrl: './tab-fin.component.html',
  styleUrls: ['./tab-fin.component.css']
})
export class TabFinComponent {


  /**
   *
   */
  constructor(
      public finService: FinanceiroService,
      private colab: ColaboradorService,
  ) {

  }
destacarLinha(l:any) {
  if (this.finService.Atual.id == 0){
    alert ('Você deve primeiro selecionar um cliente na guia FICHA DE CLIENTES')
  }else{
    this.finService.tabFinanceira.forEach(s => s.selecionada = false);// Desmarcar todas as outras linhas
    const sel = this.finService.tabFinanceira.find(x =>
      x.id === l)
      if (sel !== undefined){
        if (sel.valor == null){
          sel.valor = 0;
        }
        sel.selecionada = true;
        this.finService.newInfo(false);
      }

      this.finService.MostraInfo = true;
  }
}

  Selec(l:any, id: number,event:any, valor: number | null){
    this.destacarLinha(l.id)

  }
}
