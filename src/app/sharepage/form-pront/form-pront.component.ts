import { HeaderService } from './../navbar/header.service';
import { ColaboradorService } from './../../services/colaborador/colaborador.service';
import { Prontuario } from 'src/app/models/Prontuarios';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { ProntuarioService } from 'src/app/services/prontuario/prontuario.service';
import { TableData } from 'src/app/models/Tables/TableData';
import { Subscription } from 'rxjs';
import { TableProntClin } from 'src/app/models/Tables/TableProntClin';
import { UserService } from 'src/app/services';
import { TableProf } from 'src/app/models/Tables/TableProf';
import { Colaborador } from 'src/app/models/Colaboradors';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { Formacao } from 'src/app/models/Formacaos';
import { FormacaoService } from 'src/app/services/formacao/formacao.service';
import { jsPDF } from "jspdf";
import { SharedService } from 'src/app/shared/shared.service';



@Component({
  selector: 'app-form-pront',
  templateUrl: './form-pront.component.html',
  styleUrls: ['./form-pront.component.css']
})
export class FormProntComponent implements OnInit {
  @ViewChild(LoginComponent) login!: LoginComponent;

    //public ListaPront: TableProntClin[] = [];
    public ListaLin: TableProntClin[] = [];
    public ListaEquipe: TableProf[] = [];
    public ListaLinEq: TableProf[] = [];

    nCliente:number = 0;
    subscription: Subscription;
    nChanges!: boolean;
    Atual!: TableData;
    Colaborador!: string;
    EquipeAll!: any;
    nUser!: number;
    linkA!: string;
    tipo: string = '';

    ngOnChanges(changes: SimpleChanges) {
      // if (changes['prontuarioService']) {
      //   this.CarregarFuncionario()
      //   this.Carregar()
      // }
      // if (changes['userService']) {
      //   this.CarregarFuncionario()
      //   this.Carregar()
      // }
      // if (changes[this.nCliente]) {
      //   this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      //     this.Atual = clienteAtual;
      //   });
      //   this.clienteService.ClienteA$.subscribe(clienteA => {
      //     this.nCliente = clienteA;
      //   });
      // }
    }
  constructor(private headerService: HeaderService,
    private colaboradorService: ColaboradorService,
    private userService:UserService,
    public shared: SharedService,
    private clienteService: ClienteService,
    private formacaoService: FormacaoService,
    private prontuarioService: ProntuarioService) {

    this.subscription = this.clienteService.ChangesA$.subscribe(
      name => this.nChanges = name
    )

    this.subscription = this.clienteService.ChangesA$.subscribe(
      name => this.nChanges = name
    )
    this.subscription = this.shared.protadmChange$.subscribe(
      (valor) => {
      if (valor == true){
        this.shared.setprotadmChange(false)
        this.Carregar();
      }
  });

  }


  ngOnInit(): void {

    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.Atual = clienteAtual;
    });
    this.headerService.LinkA$.subscribe(link => {
      this.linkA = link;
    });
    this.subscription = this.clienteService.ClienteA$.subscribe(
      name => this.nCliente = name
    )
    this.userService.usuario$.subscribe(user => {
      this.Colaborador = user;
    });

    this.userService.EquipeA$.subscribe(user => {
      this.nUser = user;
    });

    this.userService.GetEquipe().subscribe(data => {
      const dadosEq = data.dados;
      dadosEq.map((i: any) => {
        i.clienteDesde !== null ? i.clienteDesde = new Date(i.clienteDesde!).toLocaleDateString('pt-BR') : '---'
        i.dtInclusao !== null ? i.dtInclusao = new Date(i.dtInclusao!).toLocaleDateString('pt-BR') : '---'
        i.dtNascim !== null ? i.dtNascim = new Date(i.dtNascim!).toLocaleDateString('pt-BR') : '---'
      })
      this.userService.equipeG = data.dados;
      this.CarregarFuncionario();
    });

    this.EquipeAll = this.colaboradorService.GetColaborador();


    this.prontuarioService.GetProntuario().subscribe(data1 => {
      this.prontuarioService.prontuarioG = data1.dados;
      this.prontuarioService.prontuarioG.sort((a, b) => (a.dtInsercao - b.dtInsercao));



      this.Carregar();
    });

  }

   Carregar(){
    this.shared.ListaPront = [];
      switch (this.linkA) {
        case "PRONTUÁRIO CLÍNICO":
          this.tipo = 'clínico'
          break;
        case "PRONTUÁRIO ADMINISTRATIVO":
          this.tipo = 'administrativo'
          break;
        case "CONTROLE FINANCEIRO":
          this.tipo = 'financeiro'
          break;
        default:
          this.tipo = ''
          break;
      }
      if(this.tipo !== ''){
      for (let i of this.prontuarioService.prontuarioG){
        if(i.idCliente == this.nCliente && i.tipo == this.tipo){
          let nomeColab = this.Colaborador;
            for (let a of this.userService.equipeG){
              if(i.idColab == a.id){
                nomeColab = a.nome;
              }
            }
          this.ListaLin = [{
            id: i.id,
            idCliente: i.idCliente,
            idColab: i.idColab,
            nomeColab: nomeColab,
            nomeCliente: this.Atual.nome,
            dtInsercao: new Date(i.dtInsercao).toLocaleDateString('pt-BR'),
            texto: i.texto,
            selecionada: false,
          }]
          this.shared.ListaPront = [...this.shared.ListaPront, ...this.ListaLin]
        }
      }
    }
    }

    CarregarFuncionario(){
      enum EnumPerfil {
        Diretoria = 'Diretoria',
        Secretaria = 'Secretaria',
        Coordenacao = 'Coordenacao',
        EquipeClinica = 'Equipe Clínica',
      }

      const idPerfilMap: { [key: number]: EnumPerfil } = {
        0: EnumPerfil.Diretoria,
        1: EnumPerfil.Secretaria,
        2: EnumPerfil.Coordenacao,
        3: EnumPerfil.EquipeClinica,
      };
      for (let i of this.userService.equipeG){
        let pForm: Formacao[] = [];
        for (const formacao of this.formacaoService.formacaos) {
          if (formacao.idFuncionario === i.id) {
            pForm.push(formacao);
          }
        }
            this.ListaLinEq = [{
              foto: '',
              ficha: (typeof i.id === 'number' ? i.id.toString() : '0'),
              id: i.id,
              nome: i.nome,
              nascimento: i.dtNasc,
              area: (typeof i.areaSession === 'string' ? i.areaSession : '0'),
              selecionada: false,
              desde: i.dtAdmis,
              proxses: '',
              celular: i.celular,
              identidade : i.rg,
              cpf : i.cpf,
              endereco : i.endereco,
              email : i.email,
              ativo : i.ativo,
              perfil: (typeof i.idPerfil === 'number' ? idPerfilMap[i.idPerfil] : 'Equipe'),
              formacao : pForm,
          }]
          this.ListaEquipe = [...this.ListaEquipe, ...this.ListaLinEq]
      }
    }

    Edita(texto: string | undefined, colab: string | undefined, cliente: string | undefined, dia: string | undefined, id: number){
      this.shared.MostraInfo = !this.shared.MostraInfo;
      if(this.shared.MostraInfo == false){
        this.shared.texto = '';
        this.shared.idTexto = 0;
      }else{

      const xtexto = texto !== undefined ? texto : '';
      const xcolab = colab !== undefined ? colab : '';
      const xcliente = cliente !== undefined ? cliente : '';
      const xdia = dia !== undefined ? dia : '';

      const txt = xtexto + '\n(informação original de ' + xdia + ', por ' + xcolab + ')'
      this.shared.texto = txt;
      this.shared.idTexto = id;
      }
    }

    Selec(i: any, event: any){
      let A = null;
      let B = null;
      for (let a of this.shared.ListaPront){
        if (a.id == i.id){
          a.selecionada = !i.selecionada
          A = a.selecionada;
          B = a.id;
          break;
        }
      }
    }

}

