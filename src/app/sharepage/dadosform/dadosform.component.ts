import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,FormsModule } from '@angular/forms'; // Importe FormsModule



interface FormField {
  name: string;
  label: string;
  type: string;
  value?: any;
  options?:string[];
  class?: string;
  required: boolean;
  model: string;
  arg1?: any;
  arg2?: any;
  arg3?: any;
  arg4?: any;
}

@Component({
  selector: 'app-dadosform',
  templateUrl: './dadosform.component.html',
  styleUrls: ['./dadosform.component.css']
})


export class DadosformComponent {
  formulario: FormGroup;



  @Input() formFields: FormField[] = [];

  public condicao = 'campo2 == true'
  public Resultado = 'ainda sem resultados';

  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({

    });

}
}
