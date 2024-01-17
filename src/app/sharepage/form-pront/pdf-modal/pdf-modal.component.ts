import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import * as fs from 'fs';
import * as docx from "docx";
import { SharedService } from 'src/app/shared/shared.service';
import { TableProntClin } from 'src/app/models/Tables/TableProntClin';
import { ProntuarioService } from 'src/app/services/prontuario/prontuario.service';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.css']
})
export class PdfModalComponent {

  @ViewChild('content', {static:true}) el!: ElementRef;

  public Lista: TableProntClin[] = [];
  public Linha: TableProntClin[] = [];
  public cliadm: string = ' (' + this.prontuarioService.tipo + ' - ' + new Date().toLocaleDateString('pt-BR') + ')';
  public CLienteNome: string = '';

  constructor(
    public dialogRef: MatDialogRef<PdfModalComponent>,
    public shared: SharedService,
    public prontuarioService: ProntuarioService,


  ) {
    for (let i of this.shared.ListaPront){
      if (i.selecionada == true){
        this.Linha = [{
          id: i.id,
          idCliente: i.idCliente,
          idColab: i.idColab,
          nomeColab: i.nomeColab,
          nomeCliente: i.nomeCliente,
          dtInsercao: i.dtInsercao,
          texto: i.texto,
          selecionada:i.selecionada,
        }]
        this.CLienteNome = i.nomeCliente !== undefined ? i.nomeCliente : 'arquivo'
        this.Lista = [...this.Lista, ... this.Linha]
      }
    }
  }

salvaPDF(){
  let pdf = new jsPDF('p','px','A4', true);
  let nome = this.CLienteNome + this.cliadm
  nome = nome.replace('/','_')
  nome = nome.replace('?','-')
  nome = nome.replace('*','-')
  console.log(nome)
  pdf.setFontSize(12);

  let texto = this.CLienteNome + '\n'
  for (let i of this.shared.ListaPront){
    if (i.selecionada == true){
      texto = texto + '\n' + i.dtInsercao + '\n' + i.texto + '\n(por: ' + i.nomeColab + ')\n';
    }
  }

  // pdf.html(this.el.nativeElement, {
  //   callback: (pdf) => {
  //     pdf.save(this.CLienteNome);
  //   }
  // })
  pdf.text(texto,12,12)
  pdf.save(nome);
  this.Fechar();
}

createWordDocument() {

}



  Fechar(){
    this.dialogRef.close();
  }
}
