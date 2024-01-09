import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Formacao } from 'src/app/models/Formacaos';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { FormacaoService } from 'src/app/services/formacao/formacao.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private colaboradorService: ColaboradorService,
    private formacaoService: FormacaoService,
  ) {} 

  private id: number = 0;
  formulario: any = {
    nomeFormacao: '',
    instituicao: '',
    dtConclusao:'',
    registro:'',
    nivel:'',
    psicologia: false,
    fisiopadovan: false,
    psicopedagogia: false,
    fono: false,
    terapiaocup: false,
    psicomotr: false,
    arteterapia: false,
    neurofeedback: false,
    reforcoesc: false,
  };
  fechar() {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.colaboradorService.ProfAtual$.subscribe(tableProf => {
      // Acesse o campo "nome" do objeto
      this.id = tableProf.id ? tableProf.id : 0;
    });
  }
  salvar(){
    
    let areasRelacionadas = '';
    if (this.formulario.psicologia == true){
      areasRelacionadas += "Psicologia,"
    }
    if (this.formulario.fisiopadovan == true){
      areasRelacionadas += "Fisioterapia Padovan,"
    }
    if (this.formulario.psicopedagogia == true){
      areasRelacionadas += "Psicopedagogia,"
    }
    if (this.formulario.fono == true){
      areasRelacionadas += "Fonoaudiologia,"
    }
    if (this.formulario.terapiaocup == true){
      areasRelacionadas += "Terapia Ocupacional,"
    }
    if (this.formulario.psicomotr == true){
      areasRelacionadas += "Psicomotricidade,"
    }
    if (this.formulario.arteterapia == true){
      areasRelacionadas += "Arteterapia,"
    }
    if (this.formulario.neurofeedback == true){
      areasRelacionadas += "Neurofeedback,"
    }
    if (this.formulario.reforcoesc == true){
      areasRelacionadas += "Reforço Escolar,"
    }
    console.log(areasRelacionadas)
    let dtConcl = '';
    try {
      dtConcl = new Date(this.formulario.dtConclusao).toISOString().split('T')[0];
    } catch (error) {
      const dataAtual = new Date();
      dtConcl = dataAtual.toISOString().split('T')[0];
    }
    const dados: Formacao = {
      id: 0,
      idFuncionario: this.id,
      dtConclusao: dtConcl,
      nivel: this.formulario.nivel,
      registro: this.formulario.registro,
      instituicao: this.formulario.instituicao,
      nomeFormacao: this.formulario.nomeFormacao,
      areasRelacionadas: areasRelacionadas,
    }
    console.log(dados)
    this.createFormacao(dados);
    setTimeout(() => {
      
    }, 300);

    this.dialogRef.close();
  }
  voltar() {
    this.dialogRef.close(); // Isso fecha o modal.
  }

  converterParaDate(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  createFormacao(formacao: Formacao){
    this.formacaoService.CreateFormacao(formacao).subscribe((data) => {
      console.log(data)
      setTimeout(() => {
      
      }, 300);
      location.reload()
    }, error => {
      console.error('Erro no upload', error);
    });
  }

}
