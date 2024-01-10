import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Documento } from 'src/app/models/Documentos';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { FileService } from 'src/app/services/foto-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importe o FormsModule
import { Colaborador } from 'src/app/models/Colaboradors';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';

@Component({
  selector: 'app-meu-modal',
  templateUrl: './meu-modal.component.html',
  styleUrls: ['./meu-modal.component.css'],
})

export class MeuModalComponent implements OnInit{

  public nome: string = '';
  public desabilita: boolean = true;
  public docto!: Documento;

  constructor(
    public dialogRef: MatDialogRef<MeuModalComponent>,
    public shared: SharedService,
    public clienteService: ClienteService,
    public colabService: ColaboradorService,
  ) {}

  ngOnInit(): void {


}
atualiza(){

}


  fechar() {
    this.dialogRef.close();
  }

  voltar() {
    this.dialogRef.close(); // Isso fecha o modal.
  }



  async handleFileSelection(event: any): Promise<void> {
    const fileInput = event.target;
    this.desabilita = false;
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile: File = fileInput.files[0];

      const nome: string = this.shared.docto.idPessoa + '%' + this.shared.docto.cliOuProf + '%' + this.shared.docto.tipo+ '%' +
      this.shared.docto.nome+ '%' + this.shared.docto.formato

      const r = await this.shared.uploadFile(selectedFile, nome)

      console.log(r.dados);
      // this.convertFileToBase64(selectedFile).then((base64Data: string) => {
      //   this.docto.arquivo = base64Data;
      // });   5%teste%pdf
    }
    this.fechar()
    this.desabilita = false;
    alert('O arquivo '+ this.shared.docto.nome + ' foi salvo e atribuído a ' + this.shared.nome +'.')
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  downloadArquivo() {
    const decodedData = atob(this.shared.docto.arquivo);
    const arrayBuffer = new ArrayBuffer(decodedData.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < decodedData.length; ++i) {
      uint8Array[i] = decodedData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    // Criar um link temporário
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arquivo.baixado'; // Nome do arquivo para download
    document.body.appendChild(link);

    // Simular o clique para iniciar o download
    link.click();

    // Remover o link temporário
    document.body.removeChild(link);
  }

}
