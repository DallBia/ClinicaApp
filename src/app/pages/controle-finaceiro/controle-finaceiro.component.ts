import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/models/Clientes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Colaborador } from 'src/app/models/Colaboradors';
import { TableData } from 'src/app/models/Tables/TableData';
import { UserService } from 'src/app/services';
import { ColaboradorService } from 'src/app/services/colaborador/colaborador.service';
import { ProntuarioService } from 'src/app/services/prontuario/prontuario.service';
import { BlocoNotasComponent } from 'src/app/sharepage/bloco-notas/bloco-notas.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/foto-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FinanceiroService } from 'src/app/services/financeiro/financeiro.service';
import { Financeiro } from 'src/app/models/Financeiro';
import { HeaderService } from 'src/app/sharepage/navbar/header.service';

@Component({
  selector: 'app-controle-finaceiro',
  templateUrl: './controle-finaceiro.component.html',
  styleUrls: ['./controle-finaceiro.component.css']
})
export class ControleFinaceiroComponent implements OnInit, OnDestroy{


  @ViewChild(BlocoNotasComponent) blocoNotas!: BlocoNotasComponent;
  @ViewChild(LoginComponent) login!: LoginComponent;
  texto: string = '';
  private subscription!: Subscription;
  // nCliente!: number;
  // Atual!: TableData;
  public Ficha: string = 'FICHA';
  public NomeCliente: string = '';

  public idFoto: string = '';
  // public User!:Colaborador;
  public nUser!: number;
  public UserAll!: any;
  public tela: string = 'padrão';
  public btnTab: string = 'Tabela de Valores'
  public btnCliFunc: string = '(Clínica->Funcionário)'
  public tela1: string = 'cli'


  constructor(private colaboradorService: ColaboradorService,
    public clienteService: ClienteService,
    public fotoService: FileService,
    private prontuarioService: ProntuarioService,
    private router: Router,
    private headerService: HeaderService,
    public shared: SharedService,
    private userService: UserService,
    public finService: FinanceiroService,
    ) {
    this.subscription = this.clienteService.ClienteA$.subscribe(
      nameC => this.finService.nCliente = nameC
    )
    this.subscription = this.userService.EquipeA$.subscribe(
      nameC => this.nUser = nameC
    )
  //   this.subscription = this.finService.ctrFinChange$.subscribe(
  //     (valor) => {
  //     if (valor == true){
  //       this.finService.setctrFinChange(false)
  //       this.Carregar();
  //     }
  // });
    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.finService.Atual = clienteAtual;
    });
  }

altTab(){
  if (this.tela == 'padrão'){
    this.tela = 'valores'
    this.btnTab = 'Voltar para Controle'
  }else{
    this.tela = 'padrão'
    this.btnTab = 'Tabela de Valores'
  }
}


altCliFunc(){
  if (this.tela1 == 'cli'){
    this.tela1 = 'func'
    this.btnCliFunc = '(Cliente->Clínica)'
  }else{
    this.tela1 = 'cli'
    this.btnCliFunc = '(Clínica->Funcionário)'
  }
}


  ngOnInit() {
    this.finService.zerar();
    this.finService.tabFinanceira = [];
    this.subscription = this.clienteService.ClienteA$.subscribe(
      nameC => this.finService.nCliente = nameC
    )
    this.subscription = this.userService.EquipeA$.subscribe(
      nameC => this.nUser = nameC
    )

    this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
      this.finService.Atual = clienteAtual;
    });

    this.UserAll = this.colaboradorService.GetColaborador();
// this.delay(300);
    const Funcionarios = this.colaboradorService.GetEquipeMinimal()
    if(this.finService.nCliente !== 0){
        this.Ficha = this.finService.Atual.Ficha;
      this.NomeCliente = this.finService.Atual.nome.toUpperCase();
      this.idFoto = '../../../assets/img/Clientes/' + this.Ficha + '.jpg'
      console.log(this.finService.nCliente)
      }else{
      this.Ficha = 'FICHA';
      this.NomeCliente = '';

    }
    this.finService.MostraInfo = false;
    //this.newInfo(this.finService.MostraInfo);

    const dados = this.BuscaValores()
    this.Carregar(dados);

  }

  async BuscaValores(){
    let data = 'nada por enquanto 2'
    try{
      data = await this.shared.BuscaValores();
      const retorno001 = await this.finService.getFinanceiroById(this.finService.nCliente);
    }
    catch{

    }
    return data;
  }
  Carregar(dados: any){
    this.finService.zerar();

    console.log('ListaFuncionário:')
    console.log(this.finService.ListaFuncionario)
    const sel = this.userService.getEquipeA().getValue()
    for(let i of this.finService.ListaFuncionario){
      if(i.id == sel){
        this.finService.info_AtualizadoPor = i.nome;
        this.finService.Usuário = i.nome;
      }
    }
  }
  receberPagto(valor: string){
    if (this.finService.info_Valor !== undefined){

      // let valorOriginal: any = this.finService.info_Valor.substring(3, 18)
      let valorOriginal = parseFloat(this.finService.info_Valor.replace(/[^\d,]/g, '').replace(',', '.'));
      let valorPagto = parseFloat(this.finService.info_GeraPagto.replace(/[^\d,]/g, '').replace(',', '.'));
      let origNumerico: number = !Number.isNaN(valorOriginal) ? valorOriginal : 0;
      let pagtoNumerico: number = !Number.isNaN(valorPagto) ? valorPagto : 0;

      if (origNumerico > 0 && pagtoNumerico == 0){
        this.finService.info_GeraPagto = this.finService.info_Valor
        let dt =  new Date().toISOString();
        dt = dt.substring(0,10)
        let dt2 = dt.split('-')
        dt = dt2[2] + '/' + dt2[1] + '/' + dt2[0]
        this.finService.info_DataAt = dt;
      }
    }
  }






  newInfo(opt: boolean){
    if (this.finService.Atual.id == 0){
      alert ('Você deve primeiro selecionar um cliente na guia FICHA DE CLIENTES')
    }else{
      this.finService.MostraInfo = !opt;
      if(this.finService.MostraInfo == false){
        this.finService.tabFinanceira.forEach(s => s.selecionada = false);
        this.finService.zerar();
      }
    }
  }

  async Enviar(){
    if(this.finService.MostraInfo == false){
      alert ('Não há nada a ser salvo por enquanto...')
    }else{



      const valorNumerico = this.finService.info_Valor.replace(/[^\d,]/g, '');
      const valorPontoFlutuante = valorNumerico.replace(',', '.');
      const resultado = parseFloat(valorPontoFlutuante);
      let valor = isNaN(resultado) ? 0 : resultado;
      if(this.finService.info_Credito == false){
        valor =  valor*(-1)
      }
      const novaData = this.finService.info_Data.split('/');
      const data = novaData[2]+'-'+novaData[1]+'-'+novaData[0]
      const dado: Financeiro = {
        id: this.finService.idLinha,
        idCliente: this.finService.Atual.id !== undefined ? this.finService.Atual.id : 0,
        idFuncAlt: this.finService.info_numAtualizadoPor !== undefined ? this.finService.info_numAtualizadoPor : 0,
        nome: this.finService.info_Movimento,
        descricao: this.finService.info_Descricao,
        data: data,
        valor: valor,
        selecionada: false,
        refAgenda:this.finService.info_refAg,
        recibo: this.finService.info_Recibo,
      }
      if(this.finService.idLinha){
        const result = await this.finService.updateFinanceiro(dado)
        const id = this.finService.Atual.id !== undefined ? this.finService.Atual.id : 0;
        this.finService.getFinanceiroById(id)
        alert('Dados atualizados!')
        this.router.navigate(['/controleFinaceiro']);
      }else{
        const result = await this.finService.createFinanceiro(dado)
        const id = this.finService.Atual.id !== undefined ? this.finService.Atual.id : 0;
        this.finService.getFinanceiroById(id)
        alert('Dados inseridos com sucesso!')
        this.router.navigate(['/controleFinaceiro']);
      }
    }
  }



 ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}


