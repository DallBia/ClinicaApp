import { Component } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-arquivo',
  templateUrl: './modal-arquivo.component.html',
  styleUrls: ['./modal-arquivo.component.css']
})
export class ModalArquivoComponent {


/**
 *
 */
    constructor(
      public shared: SharedService,
      public dialogRef: MatDialogRef<ModalArquivoComponent>,
    ) {


    }

open()
{}

    fechar() {
      this.dialogRef.close();
    }

}
