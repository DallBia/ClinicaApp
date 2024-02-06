import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { Colaborador } from "src/app/models/Colaboradors";
import { TableProf } from "src/app/models/Tables/TableProf";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services";
import { ColaboradorService } from "src/app/services/colaborador/colaborador.service";
import { FormacaoService } from "src/app/services/formacao/formacao.service";
import { FormClienteComponent } from "src/app/sharepage/form-cliente/form-cliente.component";
import { FormsComponent } from "src/app/sharepage/forms/forms.component";
import { ModalComponent } from "../../sharepage/forms/modal/modal.component";
import { MatDialog } from "@angular/material/dialog";
import { EquipeModalComponent } from "./equipe-modal/equipe-modal.component";
import { PerfilService } from "src/app/services/perfil/perfil.service";
import { SharedService } from "src/app/shared/shared.service";
import { FileService } from 'src/app/services/foto-service.service';
import { ModalArquivoComponent } from 'src/app/sharepage/arquivos/modal-arquivo/modal-arquivo.component';
import { MeuModalComponent } from "../fichacliente/meu-modal/meu-modal.component";
import { Formacao } from "src/app/models/Formacaos";
import { Response } from '../../models/Response';
import { environment } from "src/environments/environment";
import { ModalConfirComponent } from 'src/app/sharepage/modal-confir/modal-confir.component';


@Component({
  selector: 'app-cadprof',
  templateUrl: './cadprof.component.html',
  styleUrls: ['./cadprof.component.css'],
  template: `
  <label>{{ selectedName }}</label>
`
})
export class CadprofComponent implements OnDestroy, OnInit {

  @ViewChild(FormsComponent) formProf!: FormsComponent;

    Atual: TableProf = {
      foto: '',
      ficha: 'string',
      id: 0,
      nome: 'string',
      nascimento: 'any',
      area: '',
      selecionada: false,
      desde: '',
      proxses: '',
      celular: '',
      identidade : '',
      cpf : '',
      endereco : '',
      email : '',
      ativo : true,
      perfil : '',
      formacao: undefined
    };

    pLin: TableProf[] = [];
    dataSource: TableProf[] = [];
    ColAt!: TableProf;
    ProfVazio: Colaborador = {
      id: 0,
      foto: '',
      nome: '',
      dtNasc: '1900-01-01',
      rg: '',
      cpf: '',
      endereco: '',
      telFixo: '',
      celular: '',
      email: '',
      dtAdmis: '1900-01-01',
      dtDeslig: '1900-01-01',
      idPerfil: 0,
      ativo: true,
      areaSession: '',
      senhaHash: '',
    }
    nProf = 1;
    EAtual!: Colaborador; // guarda o usuário atual
    nEquipe: number = 0;
    FAtual: any; //guarda a lista de Formações do usuário.
    nFormacao: number = 0;
    public Usr!: User;
    nUsr:number = 0;
    private subscription: Subscription;
    nChanges: boolean = false;
    Selecionada: string = '';
    ListaEquipe: any;
    ListaFormacaos: any;
    vNovo: boolean = true;
    public btnSalva: boolean = false;
    public txtSalva: string = "Salvar";
    private control!:any;
    private ctrl1: boolean = false;
    private ctrl2: boolean = false;

    private estadoMonitorado = new BehaviorSubject<boolean>(false);
  http: any;

  constructor(private formacaoService: FormacaoService,
    private userService: UserService,
    public dialog: MatDialog,
    private perfilService: PerfilService,
    public colaboradorService: ColaboradorService,
    public formacao: FormacaoService,
    public shared: SharedService,
    public sharedService: SharedService,

    ){
      this.subscription = this.colaboradorService.EquipeA$.subscribe(
        name => this.nEquipe = name
      );


    }

  ngOnInit(){
    this.colaboradorService.dataSource = [];


    // this.colaboradorService.inicio();

    this.subscription = this.colaboradorService.ProfAtual$.subscribe(EquipeAtual => {
      this.ColAt = EquipeAtual;
    });
    this.subscription = this.colaboradorService.ChangesA$.subscribe(chng => {
      this.nChanges = chng;
    });
    this.subscription = this.colaboradorService.EquipeAtual$.subscribe(eat => {
      this.EAtual = eat;
    });

    this.colaboradorService.vNovoCadProf = this.perfilService.validaPerfil(0, 3)
    this.colaboradorService.vSalvarCadProf = this.perfilService.validaPerfil(2, 4)
    this.colaboradorService.iniciar();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  gerarSenha() {
    const caracteresMaiusculos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const caracteresMinusculos = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const caracteresEspeciais = '!@#$%^&*()-_+=<>?';

    const todosCaracteres = caracteresMaiusculos + caracteresMinusculos + numeros + caracteresEspeciais;

    let senha = '';
    senha += caracteresMaiusculos[Math.floor(Math.random() * caracteresMaiusculos.length)];
    senha += caracteresMinusculos[Math.floor(Math.random() * caracteresMinusculos.length)];
    senha += numeros[Math.floor(Math.random() * numeros.length)];
    senha += caracteresEspeciais[Math.floor(Math.random() * caracteresEspeciais.length)];

    for (let i = 4; i < 8; i++) {
        senha += todosCaracteres[Math.floor(Math.random() * todosCaracteres.length)];
    }

    // Embaralhe a senha para garantir aleatoriedade
    senha = senha.split('').sort(() => Math.random() - 0.5).join('');

    return senha;
}

abrirModal(){
  this.sharedService.nome = this.sharedService.ListaProfs.nome;

  this.sharedService.docto = {
    idPessoa: this.sharedService.ListaProfs.id !== undefined ? this.sharedService.ListaProfs.id : 0,
    cliOuProf:'E',
    tipo: '',
    nome: '',
    descricao: '',
    dtInclusao: new Date().toISOString(),
    arquivo: '',
    formato: '',
    id:1,
  }
  const dialogRef = this.dialog.open(MeuModalComponent, {
      disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
  });
  dialogRef.afterClosed().subscribe(result => {

  });
}




async Salvar(){
  if (this.txtSalva == "Salvar"){
    this.txtSalva = "Aguarde..."
    const salvarAnterior = this.colaboradorService.vSalvarCadProf
    this.colaboradorService.vSalvarCadProf = false

    this.delay(300);
  const Dados = this.formProf.submitE()
  let ProfAlt = this.ProfVazio;
  if (ProfAlt !== null){
    ProfAlt.ativo = Dados.ativo;
    if (ProfAlt.ativo === true){
      ProfAlt.dtDeslig = new Date('1900-01-01').toISOString();
    }else{
      if (ProfAlt.dtDeslig == ''){
        ProfAlt.dtDeslig = new Date().toISOString();
      }
    }
    ProfAlt.foto = this.colaboradorService.fotoAtual;
    ProfAlt.id = Dados.id;
    ProfAlt.celular = Dados.celular;
    ProfAlt.telFixo = Dados.telFixo;
    ProfAlt.cpf = Dados.cpf;
    ProfAlt.dtAdmis = this.shared.datas(Dados.desde,'Banco');
    ProfAlt.email = Dados.email;
    ProfAlt.endereco = Dados.endereco;
    ProfAlt.rg = Dados.identidade;
    ProfAlt.dtNasc =  this.shared.datas(Dados.nascimento,'Banco')
    ProfAlt.nome = Dados.nome;

        let valorPsicologia = false;
        let valorFisioPadovan = false;
        let valorPsicopedagogia = false;
        let valorFonoaudiologia = false;
        let valorTerOcup = false;
        let valorPsicomotric = false;
        let valorArteterapia = false;
        let valorNeurofeedback = false;
        let valorReforcoEsc = false;
        let ListaFormac: Formacao[] = []

        let areas: string = '';
        for (let z of this.colaboradorService.formFields){

            valorPsicologia = valorPsicologia === false ? z.psicologia : true;
            valorFisioPadovan = valorFisioPadovan === false ? z.fisiopadovan : true;
            valorPsicopedagogia = valorPsicopedagogia === false ? z.psicopedagogia : true;
            valorFonoaudiologia = valorFonoaudiologia === false ? z.fono : true;
            valorTerOcup = valorTerOcup === false ? z.terapiaocup : true;
            valorPsicomotric = valorPsicomotric === false ? z.psicomotr : true;
            valorArteterapia = valorArteterapia === false ? z.arteterapia : true;
            valorNeurofeedback = valorNeurofeedback === false ? z.neurofeedback : true;
            valorReforcoEsc = valorReforcoEsc === false ? z.reforcoesc : true;
            areas = valorPsicologia ==true ? areas + 'Psicologia,' : areas;
            areas = valorFisioPadovan ==true ? areas + 'Fisio Padovan,' : areas;
            areas = valorPsicopedagogia ==true ? areas + 'Psicopedagogia,' : areas;
            areas = valorFonoaudiologia ==true ? areas + 'Fonoaudiologia,' : areas;
            areas = valorTerOcup ==true ? areas + 'Terapia Ocup.,' : areas;
            areas = valorPsicomotric ==true ? areas + 'Psicomotricidade,' : areas;
            areas = valorArteterapia ==true ? areas + 'Arteterapia,' : areas;
            areas = valorNeurofeedback ==true ? areas + 'Neurofeedback,' : areas;
            areas = valorReforcoEsc ==true ? areas + 'Reforço escolar,' : areas;

            let areasRel: string = '';
            areasRel = z.psicologia ==true ? areasRel + 'Psicologia,' : areasRel;
            areasRel = z.fisiopadovan ==true ? areasRel + 'Fisio Padovan,' : areasRel;
            areasRel = z.psicopedagogia ==true ? areasRel + 'Psicopedagogia,' : areasRel;
            areasRel = z.fono ==true ? areasRel + 'Fonoaudiologia,' : areasRel;
            areasRel = z.terapiaocup ==true ? areasRel + 'Terapia Ocup.,' : areasRel;
            areasRel = z.psicomotr ==true ? areasRel + 'Psicomotricidade,' : areasRel;
            areasRel = z.arteterapia ==true ? areasRel + 'Arteterapia,' : areasRel;
            areasRel = z.neurofeedback ==true ? areasRel + 'Neurofeedback,' : areasRel;
            areasRel = z.reforcoesc ==true ? areasRel + 'Reforço escolar,' : areasRel;


            let dados = {
              id: z.id,
              idFuncionario: Dados.id,
              dtConclusao: z.dtConclusao,
              nivel: z.nivel,
              registro: z.registro,
              instituicao: z.instituicao,
              nomeFormacao: z.nomeFormacao,
              areasRelacionadas: areasRel,
            }
            const r = await this.formacaoService.UpdateFormacao(dados)
            setTimeout(() => {

            }, 200);
            }


    switch (Dados.perfil){
      case 'Diretoria':
        ProfAlt.idPerfil = 0;
        break;
      case 'Secretaria':
        ProfAlt.idPerfil = 1;
        break;
      case 'Coordenação':
        ProfAlt.idPerfil = 2;
        break;
        case 'Equipe Clínica':
        ProfAlt.idPerfil = 3;
        break;
      default:
      ProfAlt.idPerfil = 3;
    }
    ProfAlt.senhaHash = '';
    ProfAlt.senhaProv = '';
    ProfAlt.areaSession = areas;
    if (ProfAlt !== null){
      //this.AtualizarProf(this.ProfAlt)
      this.colaboradorService.UpdateEquipe(ProfAlt).subscribe((data) => {
        this.colaboradorService.vSalvarCadProf = salvarAnterior
      this.txtSalva = "Salvar"
      this.delay(300)
       const dados = this.colaboradorService.GetCol();
      alert('Registro atualizado!')
      this.colaboradorService.iniciar();
    }, error => {
      console.error('Erro no upload', error);
    });
    }
  }
}
}

  CliqueNovo(){
    this.userService.alertas = true;
    const dialogRef = this.dialog.open(EquipeModalComponent, {
      disableClose: true  // Isto impede que o modal seja fechado ao clicar fora dele ou pressionar ESC
  });
  dialogRef.afterClosed().subscribe((result: any) => {

  });
//   const senhaGerada = this.gerarSenha();
// console.log(senhaGerada);
// alert(senhaGerada)
  }

  AtualizarProf(dado: Colaborador){
    this.colaboradorService.UpdateEquipe(dado).subscribe((data) => {
       this.delay(300)
       const dados = this.colaboradorService.GetCol();
       console.log(dados)
      alert('Registro atualizado!')
      location.reload()
    }, error => {
      console.error('Erro no upload', error);
    });
  }
  reDatas(dataO: string){

    const [dia, mes, ano] = dataO.split('/');
    if(dia.length == 2){
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
      const dataFormatada = data.toISOString().split('T')[0];
       return (dataFormatada);
    }
    else{
       return (dataO);
    }

  }

  delay(time:number) {
    setTimeout(() => {

    }, time);
  }

  cancela(){
    this.sharedService.textoModal = 'Excluir uma ficha é um procedimento IRREVERSÍVEL. Considere, em vez disso, desativar a ficha.'
    this.sharedService.tituloModal = 'ATENÇÃO!'
    this.sharedService.nbotoes = ['Sim, tenho certeza do que estou fazendo', 'Não, vou pensar melhor antes de excluir', 'Fechar']
    const dialogRefConfirm = this.dialog.open(ModalConfirComponent, {

    });
    dialogRefConfirm.afterClosed().subscribe(result => {
        if (this.sharedService.respostaModal[0] == 'S'){
          this.excluir();
        }
    });
    }

    excluir(){
      const n = parseInt(this.ColAt.ficha)
      this.colaboradorService.DeleteUser(n).subscribe((data) => {
        this.delay(300)
        alert('Registro apagado!')
        this.sharedService.ClienteAtual = 0;
        location.reload()

      }, error => {
        alert('Houve algum erro ao excluir')
        console.error('Erro no upload', error);
      });
    }





}


