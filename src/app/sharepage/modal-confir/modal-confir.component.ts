import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-modal-confir',
  templateUrl: './modal-confir.component.html',
  styleUrls: ['./modal-confir.component.css']
})
export class ModalConfirComponent implements OnInit, OnDestroy{

  /**
   *
   */
  constructor(public shared: SharedService,
              public dialogRef: MatDialogRef<ModalConfirComponent>,
    ) {

  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

  }

  select(nome: string){
    this.shared.respostaModal = nome;
    this.dialogRef.close();
  }


}
