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
import { Tipo } from 'src/app/models/Tipo';



@Component({
  selector: 'app-form-pront',
  templateUrl: './form-pront.component.html',
  styleUrls: ['./form-pront.component.css']
})
export class FormProntComponent implements OnInit {
  @ViewChild(LoginComponent) login!: LoginComponent;

    tipo: string = '';
    subscription!: Subscription;
    private ListaPront: Prontuario[] = [];

    ngOnChanges(changes: SimpleChanges) {

    }
  constructor(private headerService: HeaderService,
    private colaboradorService: ColaboradorService,
    private userService:UserService,
    public shared: SharedService,
    private clienteService: ClienteService,
    private formacaoService: FormacaoService,
    private prontuarioService: ProntuarioService) {


  }


  ngOnInit(): void {

    this.prontuarioService.prontuarioG$.subscribe(data1 => {
      if (data1.length !==0){
        this.ListaPront = data1
      this.Carregar();
      }
    });

  }

   async Carregar(){
    const clienteTmp = window.sessionStorage.getItem('nCli');
    console.log(clienteTmp)
    this.shared.ListaPront = [];
        let cliente: number;
        try{

          if (clienteTmp !== null){
            cliente = parseInt(clienteTmp);
          }else{
            cliente = 0;
          }

        }catch{
          cliente = 0
        }
      for (let i of this.ListaPront){
        if(i.idCliente == cliente && i.tipo == this.prontuarioService.tipo){
          let nomeColab = '';
          let perfil = '';
          let nome = '';
          if (this.prontuarioService.ListaNome !== undefined){

            for (let l of this.prontuarioService.ListaNome){
              if (l.id == i.idColab){
                nome = l.nome;
              }
            }
          }
          if (this.prontuarioService.ListaPerfil !== undefined){

            for (let l of this.prontuarioService.ListaPerfil){
              if (l.id == i.idColab){
                perfil = l.nome;
              }
            }
            switch (perfil){
              case ('0'):
                nomeColab = nome + ' (Diretoria)';
                break;
              case ('1'):
                nomeColab = nome + ' (Secretaria)';
                break;
              case ('2'):
                nomeColab = nome + ' (Coordenação)';
                break;
              case ('3'):
                nomeColab = nome + ' (Equipe Clínica)';
                break;
              default:
                nomeColab = nome + ' ( indefinido )';
                break;
            }
          }

          const ListaLin = [{
            id: i.id,
            idCliente: i.idCliente,
            idColab: i.idColab,
            nomeColab: nomeColab,
            nomeCliente: this.prontuarioService.nome,
            dtInsercao: new Date(i.dtInsercao).toLocaleDateString('pt-BR'),
            texto: i.texto,
            selecionada: false,
          }]
          this.shared.ListaPront = [...this.shared.ListaPront, ...ListaLin]
        }
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

