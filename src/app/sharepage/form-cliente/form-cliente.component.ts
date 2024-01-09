import { Grid01Component } from 'src/app/sharepage/grid01/grid01.component';
import { Component, ViewChild, ElementRef, Input , SimpleChanges, OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { TableData } from 'src/app/models/Tables/TableData';
import { of } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Cliente } from 'src/app/models/Clientes';
import { CanComponentDeactivate, CanDeactivateGuard } from '../../services/can-deactivate.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.css'],

})
export class FormClienteComponent implements OnInit, OnChanges {

 selectedValue = 'Cliente';
  formulario: FormGroup | undefined;
  Atual!: TableData;
  selectedFile: File | null = null;
  nCliente:number = 0;
  public ValidSai: any = false;
  public RestrMae:any = false;
  public RestrPai: any = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() onSubmit = new EventEmitter<Cliente>();


  constructor(private http: HttpClient,
    private clienteService: ClienteService,
    public shared: SharedService,
    private can: CanDeactivateGuard){}

  canDeactivate(): boolean {
    if (this.can.Alteracoes == true) {
      return window.confirm(
        'Há informações não salvas que serão perdidas. Deseja sair da edição?'
      );
    }
    return true; // Pode sair sem alerta se não houver mudanças não salvas.
  }
  clienteform!: FormGroup;

  submit(){
    this.onSubmit.emit(this.clienteform.value);
  }

  ngOnInit(){

    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.Atual = clienteAtual;
    });
    this.clienteService.ClienteA$.subscribe(clienteA => {
      this.nCliente = clienteA;
    });

    this.CarregaForm();

    this.clienteform.valueChanges.subscribe(novosValores => {
      this.can.Alteracoes = true;
    });
  }

  CarregaForm(){

    if(this.Atual.saiSozinho == 'Sim'){
      this.ValidSai = true
    }
    if(this.Atual.maeRestric == 'Sim'){
      this.RestrMae = true
    }
    if(this.Atual.paiRestric == 'Sim'){
      this.RestrPai = true
    }

    let AtualID = this.Atual.id;
    if(AtualID == -1){
      AtualID = 0
    }

    this.clienteform = new FormGroup({
      id:new FormControl(this.Atual.id),
      nome:new FormControl(this.Atual.nome),
      saiSozinho:new FormControl(this.ValidSai),
      dtInclusao:new FormControl(this.Atual.dtInclusao),
      clienteDesde:new FormControl(this.Atual.clienteDesde),
      ativo:new FormControl(this.Atual.ativo),
      areaSession:new FormControl(this.Atual.areaSession),
      respFinanc:new FormControl(this.Atual.respFinanc),
      cpf:new FormControl(this.Atual.cpf),
      identidade:new FormControl(this.Atual.identidade),
      dtNascim:new FormControl(this.Atual.dtNascim),
      celular:new FormControl(this.Atual.celular),
      telFixo:new FormControl(this.Atual.telFixo),
      telComercial:new FormControl(this.Atual.telComercial),
      email:new FormControl(this.Atual.email),
      endereco:new FormControl(this.Atual.endereco),

      mae:new FormControl(this.Atual.mae),
      maeRestric:new FormControl(this.RestrMae),
      maeIdentidade:new FormControl(this.Atual.maeIdentidade),
      maeCpf:new FormControl(this.Atual.maeCpf),
      maeCelular:new FormControl(this.Atual.maeCelular),
      maeTelFixo:new FormControl(this.Atual.maeTelFixo),
      maeTelComercial:new FormControl(this.Atual.maeTelComercial),
      maeEmail:new FormControl(this.Atual.maeEmail),
      maeEndereco:new FormControl(this.Atual.maeEndereco),

      pai:new FormControl(this.Atual.pai),
      paiRestric:new FormControl(this.RestrPai),
      paiIdentidade:new FormControl(this.Atual.paiIdentidade),
      paiCpf:new FormControl(this.Atual.paiCpf),
      paiCelular:new FormControl(this.Atual.paiCelular),
      paiTelFixo:new FormControl(this.Atual.paiTelFixo),
      paiTelComercial:new FormControl(this.Atual.paiTelComercial),
      paiEmail:new FormControl(this.Atual.paiEmail),
      paiEndereco:new FormControl(this.Atual.paiEndereco),
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes[this.nCliente]) {

      this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
        this.Atual = clienteAtual;
      });
      this.clienteService.ClienteA$.subscribe(clienteA => {
        this.nCliente = clienteA;
      });

    }
    const Tab = this.clienteform.valueChanges;
    console.log(Tab);
  }



  ngOnDestroy(){

  }



  base64ImageData: string = '';

  selectFile(): void {
    // Simula um clique no elemento de input de arquivo escondido
    const inputElement: HTMLInputElement | null = document.querySelector('#inputFile');

  // Verifica se o elemento foi encontrado
  if (inputElement) {
    // Simula um clique no elemento de input de arquivo escondido
    inputElement.click();
  } else {
    console.error('arquivo não encontrado.');
  }
  }

  onFileSelected(event: Event): void {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;
    const arquivo: File = (inputElement.files as FileList)[0];

    // Verifica se um arquivo foi selecionado
    if (arquivo) {
      if (arquivo.size <500000){
        const leitor: FileReader = new FileReader();

      // Define o evento onload para o leitor
      leitor.onload = () => {
        this.base64ImageData = leitor.result as string;
        this.Atual.foto = this.base64ImageData;
        this.clienteService.fotoAtual = this.base64ImageData;
      };

      // Lê o conteúdo do arquivo como uma URL de dados (Base64)
      leitor.readAsDataURL(arquivo);
      }else{
        alert('Escolha um arquivo menor. Este arquivo é muito grande.')
      }

    }
  }
}
