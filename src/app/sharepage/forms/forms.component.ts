import { Component, ViewChild, ElementRef, Input , OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormsModule , FormControl, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { Colaborador } from 'src/app/models/Colaboradors';
import { Formacao } from 'src/app/models/Formacaos';
import { FormacaoService } from 'src/app/services/formacao/formacao.service';
import { TableProf } from 'src/app/models/Tables/TableProf';
import { ModalComponent } from './modal/modal.component';
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from 'src/app/shared/shared.service';
import { Perfil } from 'src/app/models/Perfils';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { FileService } from 'src/app/services/foto-service.service';





interface FormField {
  id:number,
  idFuncionario: number,
  dtConclusao: any,
  nivel: string,
  registro: string,
  instituicao: string,
  nomeFormacao: string,
  areasRelacionadas:string,
  psicologia:boolean,
  fisiopadovan:boolean,
  psicopedagogia:boolean,
  terapiaocup:boolean,
  fono:boolean,
  arteterapia:boolean,
  psicomotr:boolean,
  neurofeedback:boolean,
  reforcoesc:boolean,
}

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})

export class FormsComponent implements OnDestroy, OnInit {
// ================= -- VARIÁVEIS -- =============================
  equipeform!: FormGroup;
  formacaoform!: FormGroup;
  public formform: FormGroup[] = [];
  public Colab!: Colaborador;
  public xFormacao!: Formacao[];
  nColab:number = 0;
  public Atual!: TableProf;
  public caminho: string = 'https://drive.google.com/uc?export=view&id=1IFS7L3CGfUjpAVdEyulTBrMzcWOgcmvf';
  @Output() submitForm: EventEmitter<any> = new EventEmitter<any>();
  formFields: FormField[] = [];
  formField!: FormField

  // ========================================================
  constructor(private http: HttpClient,
      private colaboradorService: ColaboradorService,
      private formacaoService: FormacaoService,
      private userService: UserService,
      public dialog: MatDialog,
      private formBuilder: FormBuilder,
      public shared: SharedService,
      public perfilService: PerfilService,
      private fotoService: FileService,
      ){

  }
  ngOnInit(): void {

    this.colaboradorService.ProfAtual$.subscribe(Atual => {
      this.Atual = Atual;
      this.CarregaForm();

    });


    // this.colaboradorService.EquipeA$.subscribe(eAtual => {
    //   this.nColab = eAtual;
    //   this.CarregaForm();
    // });
  }

  submitE(){
    this.submitForm.emit(this.equipeform.value);
    return this.equipeform.value;
  }
  submitF(){
    this.submitForm.emit(this.formacaoform.value);
  }

  public formulario: any = {
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


  async buscaFormacao(id: number){
    this.xFormacao = await this.formacaoService.getFormacaoById(id)
  }

  CarregaForm(){
    if (this.Atual.foto == '(img)' ){
      this.Atual.foto = this.fotoService.semFoto
    }
    const id = this.Atual.id !== undefined ? this.Atual.id : 0
    const resp = this.buscaFormacao(id)
    //this.Atual.formacao = this.xFormacao;
    this.formulario = {
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
    this.equipeform = new FormGroup({
      id:new FormControl(this.Atual.id),
      perfil:new FormControl(this.Atual.perfil),
      nome:new FormControl(this.Atual.nome),
      foto:new FormControl(this.Atual.foto),
      nascimento:new FormControl(this.Atual.nascimento),
      celular:new FormControl(this.Atual.celular),
      telFixo:new FormControl(this.Atual.telFixo),
      identidade:new FormControl(this.Atual.identidade),
      cpf:new FormControl(this.Atual.cpf),
      endereco:new FormControl(this.Atual.endereco),
      email:new FormControl(this.Atual.email),
      desde:new FormControl(this.Atual.desde),
      ativo:new FormControl(this.Atual.ativo),
    });
    //this.Atual.formacao = this.xFormacao

    if (this.Atual.formacao !== undefined){

      for (let k of this.Atual.formacao) {
        //let formControl: any = {}; // Inicialize um objeto de controle para este objeto k
        let fG = new FormGroup({
        id:new FormControl(k.id),
        idFuncionario: new FormControl(k.idFuncionario),
        dtConclusao: new FormControl(k.dtConclusao),
        nivel: new FormControl(k.nivel),
        registro: new FormControl(k.registro),
        instituicao: new FormControl(k.instituicao),
        nomeFormacao: new FormControl(k.nomeFormacao),
        areasRelacionadas: new FormControl(k.areasRelacionadas),
        });
        const linha: string = '' + k.areasRelacionadas;
        const areasRelacionadasArray = linha.split(',').map(area => area.trim());

        let valorPsicologia = false;
        let valorFisioPadovan = false;
        let valorPsicopedagogia = false;
        let valorFonoaudiologia = false;
        let valorTerOcup = false;
        let valorPsicomotric = false;
        let valorArteterapia = false;
        let valorNeurofeedback = false;
        let valorReforcoEsc = false;

        for (const area of areasRelacionadasArray) {
          if(area == 'Psicologia'){
            valorPsicologia = true;
          }
          if(area == 'Fisioterapia Padovan'){
            valorFisioPadovan = true;
          }
          if(area == 'Psicopedagogia'){
            valorPsicopedagogia = true;
          }
          if(area == 'Fonoaudiologia'){
            valorFonoaudiologia = true;
          }
          if(area == 'Terapia Ocupacional'){
            valorTerOcup = true;
          }
          if(area == 'Psicomotricicade'){
            valorPsicomotric = true;
          }
          if(area == 'Arteterapia'){
            valorArteterapia = true;
          }
          if(area == 'Neurofeedback'){
            valorNeurofeedback = true;
          }
          if(area == 'Reforço Escolar'){
            valorReforcoEsc = true;
          }
        }
        const data = '' + k.dtConclusao;
        const datarray = data.split('-').map(area => area.trim());
        if(datarray[0].length == 4){
          k.dtConclusao = datarray[2] + '/' + datarray[1] + '/' + datarray[0]
        }

        this.formField = {
          id: k.id !== undefined ? k.id : 0,
          idFuncionario: k.idFuncionario,
          dtConclusao:  k.dtConclusao,
          nivel: k.nivel !== undefined ? k.nivel : '',
          registro: k.registro !== undefined ? k.registro : '',
          instituicao: k.instituicao !== undefined ? k.instituicao : '',
          nomeFormacao: k.nomeFormacao !== undefined ? k.nomeFormacao : '',
          areasRelacionadas: k.areasRelacionadas !== undefined ? k.areasRelacionadas : '',
          psicomotr: valorPsicomotric,
          terapiaocup: valorTerOcup,
          fisiopadovan: valorFisioPadovan,
          reforcoesc: valorReforcoEsc,
          neurofeedback: valorNeurofeedback,
          psicopedagogia: valorPsicopedagogia,
          fono: valorFonoaudiologia,
          arteterapia: valorArteterapia,
          psicologia: valorPsicologia,
        }
        this.formFields.push(this.formField)
        // Adicione os elementos de k ao objeto de controle

        this.formform.push(fG);
      }
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
  isChecked(substring: string, origem: string): boolean {
    // Verifica se a substring está presente em i.areasRelacionadas
    return origem.includes(substring);
  }

  ngOnDestroy(): void {

  }

  openFileInput() {
    document.getElementById('file-input')?.click();
  }




  abrirModal() {
    const dialogRef = this.dialog.open(ModalComponent, {
        disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
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
        this.colaboradorService.fotoAtual = this.base64ImageData;
      };

      // Lê o conteúdo do arquivo como uma URL de dados (Base64)
      leitor.readAsDataURL(arquivo);
      }else{
        alert('Escolha um arquivo menor. Este arquivo é muito grande.')
      }

    }
  }
}
