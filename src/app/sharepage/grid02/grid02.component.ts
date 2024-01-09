import { TableProf } from './../../models/Tables/TableProf';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services';
import { FormacaoService } from 'src/app/services/formacao/formacao.service';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { take } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-grid02',
  templateUrl: './grid02.component.html',
  styleUrls: ['./grid02.component.css']
})
export class Grid02Component implements OnInit{
  dataSource: TableProf[] = [];
  public nLin: TableProf[] = [];
  public Verifica: boolean = false;
subscription: Subscription;
  nChanges!: boolean;


  private nChn = new BehaviorSubject<boolean>(false);
  nChn$ = this.nChn.asObservable();
    setnChnl(name: boolean) {
      this.nChn.next(name);
    }


  destacarLinha(l:any, Ficha:string){
    this.nChanges = false;
    this.colaboradorService.setChangesA(false);
    let numero = parseInt(l.ficha, 10);
      if (isNaN(numero)) {
        numero = 0;
    }
    this.sharedService.ProfAtual = numero;
    for(let i of this.colaboradorService.dataSource){
      i.selecionada = false;
    }
     const xus = this.colaboradorService.dataSource.find(user => parseInt(user.ficha, 10) === numero)
   if (xus !== undefined) {
    this.colaboradorService.eAtual = xus
   }
   const dados = this.colaboradorService.colaboradorsG.find(user => user.id === numero)
   if (dados !== undefined) {
    this.sharedService.ListaProfs = dados;
   }
    let a: any;
    l.selecionada = true;
    this.sharedService.btnAnexPro = true;
    this.sharedService.PessoaDoctos = "E";
    this.sharedService.carregarListaDeArquivos()
    this.nChanges = true;
    setTimeout(() => {
      this.colaboradorService.setChangesA(true);
    }, 100)
   this.colaboradorService.setProfAtual(this.colaboradorService.dataSource.find(user => parseInt(user.ficha, 10) === numero) || a);
      this.colaboradorService.setEquipeA(numero);
  }

  constructor(public colaboradorService: ColaboradorService,
              private userService: UserService,
              private formacaoService: FormacaoService,
              public sharedService: SharedService,
              ) {


    this.subscription = this.colaboradorService.ChangesA$.subscribe(
      name => this.nChanges = name
    )

  }
  ngOnInit(): void {


  }



}
