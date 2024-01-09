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
        sel.selecionada = true;
        for(let i of this.finService.ListaFuncionario){
          if(i.id == sel.idFuncAlt){
            this.finService.info_AtualizadoPor = i.nome;
            this.finService.info_numAtualizadoPor = i.id;
          }
        }
        this.finService.idLinha = l;
        this.finService.info_Movimento = sel.nome
        const valor2 = sel.valor*(-1);
        this.finService.info_Valor = sel.valor < 0 ? valor2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : sel.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.finService.info_Credito = sel.valor < 0 ? false : true;
        this.finService.info_Data = new Date(sel.data).toLocaleDateString();
        this.finService.info_Descricao = sel.descricao
        this.finService.info_Recibo = sel.recibo
        this.finService.info_refAg = sel.refAgenda
      }

      this.finService.MostraInfo = true;
  }
}

  Selec(l:any, id: number,event:any, nome: string, valor: number){
    this.destacarLinha(l.id)

  }
}
