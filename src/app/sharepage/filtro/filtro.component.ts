import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { FormsModule } from '@angular/forms';
import {FiltroService } from '../../services/filtro.service'
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})

export class FiltroComponent implements OnInit {

  public formD: string = '';
  opcaoSelecionada: string = '';
  parametro: string = '';
  public AtivoCheck: boolean = true;
  public InativoCheck: boolean = false;
  myForm: FormGroup;

  public opcoes!: string[];
  constructor(private fb: FormBuilder,
                public shared: SharedService,
                public filtroService: FiltroService,
                public clienteService: ClienteService,
                public colaboradorService: ColaboradorService,
                ) {

    this.myForm = this.fb.group({
      username: [''],
      selectedOpcao: [''],
    });
  }

  ngOnInit(): void {
    if (this.shared.pagina == '/cadprof'){
      this.opcoes = ['Nome', 'Perfil', 'Área']; //this.opcoes = ['Nome', 'Perfil', 'Área','Nível de Graduação'];
    }else{
      this.opcoes = ['Nome', 'Nome da Mãe', 'Idade']; //this.opcoes = ['Nome', 'Nome da Mãe', 'Área','Idade'];
    }
  }

  AttParam(valor: any){
  this.formD = valor;
  }

  onSubmit() {
    this.formD = this.myForm.value;
  }

  async aplicaFiltro(){
    if (this.shared.pagina == '/cadprof'){
      this.colaboradorService.tipo = this.opcaoSelecionada;
      this.colaboradorService.valor = this.parametro;
      this.colaboradorService.lastID = 0;
      this.colaboradorService.proximo()
    }else{
      this.clienteService.tipo = this.opcaoSelecionada;
      this.clienteService.valor = this.parametro;
      this.clienteService.lastID = 0;
      this.clienteService.proximo()
    }

  }
}

