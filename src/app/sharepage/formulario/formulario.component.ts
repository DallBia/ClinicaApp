import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})

export class FormularioComponent implements OnInit {
  public formD: string = '';
  myForm: FormGroup;
  opcoes = ['Nome', 'Nome da Mãe', 'Área','Idade'];
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      username: [''],
      selectedOpcao: [''],
    });
  }

  ngOnInit(): void {}

  AttParam(valor: any){
  this.formD = valor;
  }

  onSubmit() {
    this.formD = this.myForm.value;
  }
}
