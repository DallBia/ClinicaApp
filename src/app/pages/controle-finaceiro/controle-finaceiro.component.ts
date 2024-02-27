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
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { Tipo } from 'src/app/models/Tipo';
import { TableFin } from 'src/app/models/Tables/TableFin';
import { Agenda2Service } from 'src/app/services/agenda/agenda2.service';

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
  public totalRegistros: number = 0;
  public totalValor: number = 0;
  public totalPagto: number = 0;
  public diferenca: number = 0;

  constructor(private colaboradorService: ColaboradorService,
    public clienteService: ClienteService,
    public fotoService: FileService,
    private prontuarioService: ProntuarioService,
    private router: Router,
    private perfilService: PerfilService,
    private headerService: HeaderService,
    public shared: SharedService,
    private userService: UserService,
    public finService: FinanceiroService,
    public agenda: Agenda2Service,
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
    if(this.perfilService.validaPerfil(0,9) == false){
            alert('Você não tem autorização para acessar esta página')
            this.router.navigate(['/inicio']);
          }

    this.finService.MostraInfo = false;
    this.finService.tabFinanceira = [];
    this.BuscaAg()
    console.log('Concluído')



//     if(this.perfilService.validaPerfil(0,9) == false){
//       alert('Você não tem autorização para acessar esta página')
//       this.router.navigate(['/inicio']);
//     }


//     this.finService.zerar();
//     this.finService.tabFinanceira = [];
//     this.subscription = this.clienteService.ClienteA$.subscribe(
//       nameC => this.finService.nCliente = nameC
//     )
//     this.subscription = this.userService.EquipeA$.subscribe(
//       nameC => this.nUser = nameC
//     )

//     this.clienteService.ClienteAtual$.subscribe(clienteAtual => {
//       this.finService.Atual = clienteAtual;
//     });

//     this.UserAll = this.colaboradorService.GetColaborador();
// // this.delay(300);
//     const Funcionarios = this.colaboradorService.GetEquipeMinimal()
//     if(this.finService.nCliente !== 0){
//         this.Ficha = this.finService.Atual.Ficha;
//       this.NomeCliente = this.finService.Atual.nome.toUpperCase();
//       this.idFoto = '../../../assets/img/Clientes/' + this.Ficha + '.jpg'
//       console.log(this.finService.nCliente)
//       }else{
//       this.Ficha = 'FICHA';
//       this.NomeCliente = '';

//     }
//     this.finService.MostraInfo = false;
//     //this.newInfo(this.finService.MostraInfo);

//     const dados = this.BuscaValores()
//     this.Carregar(dados);

  }


  async BuscaAg(){
    let id = '0';

    const idTmp = window.sessionStorage.getItem('nCli');

    id = idTmp == null ? '0' : idTmp;
    this.finService.idUser = parseInt(id)

    const diaI = this.finService.filtro003 !== '' ? new Date(this.finService.filtro003).toISOString() : new Date('1900-01-01').toISOString();
    const diaF = this.finService.filtro004 !== '' ? new Date(this.finService.filtro004).toISOString() : new Date('2100-01-01').toISOString();
    let f01 = this.finService.filtro001 == true ? 'T' : 'F';
    const f02 = this.finService.filtro002 == true ? 'T' : 'F';
    const f05 = this.finService.filtro005 == true ? 'T' : 'F';
    const f06 = this.finService.filtro006 == true ? 'T' : 'F';
    f01 = id !== '0' ? f01 : 'F';
    const info = f01 + '|' + f02 + '|' + diaI + '|' + diaF + '|' + f05 + '|' + f06 + '|'
    const dado: Tipo = {
      id: parseInt(id),
      nome: info
    }
    if (id !== '0'){
    const r = await this.finService.chamarFin(dado)
        let n: number = 0;
        let data = new Date();

    const fin = await this.finService.getFinanceiroByCliente(parseInt(id))

        for (let i of r){
          let proxData = '';
          this.NomeCliente = i.nome !== undefined ? i.nome : this.NomeCliente;
          if (i.repeticao !== 'Unica'){
            let resp = false
            while (resp == false){
              resp = this.calcDia(data.toISOString(), i.configRept)
              if (resp == false){
                data.setDate(data.getDate() + 1);
              }else{
                const val = i.configRept.split('%')
                const dt = this.shared.datas(data.toISOString().split('T')[0], 'Tela')
                proxData = dt + ' (' + this.semana + ':rept ' + val[0] + ')'
                data = new Date();
                console.log(i.id + ' - ' + proxData)
              }
            }
          }else{
            if (i.multi == null){
              const dt = i.diaI !== undefined ? i.diaI : new Date().toISOString().split('T')[0];
              proxData = this.shared.datas(dt, 'Tela') + ' (' + i.diaDaSemana + ')'
            }else{
              let nMulti = ''
              const dt = i.diaI !== undefined ? i.diaI : new Date().toISOString().split('T')[0];
              if (i.historico !== undefined){
                const indiceAbreParenteses = i.historico.indexOf("(");
                const indiceFechaParenteses = i.historico.indexOf(")");

                // Verifique se ambos os parênteses foram encontrados
                if (indiceAbreParenteses !== -1 && indiceFechaParenteses !== -1) {
                    // Extraia a substring entre os parênteses
                    nMulti = i.historico.substring(indiceAbreParenteses + 1, indiceFechaParenteses);
                    nMulti = nMulti.replace(' de ','/')
                  }


              proxData = this.shared.datas(dt, 'Tela') + ' (' + i.diaDaSemana + ':pct ' + nMulti +')'
            }
          }
          }
          const num1 = i.valor !== undefined && i.valor !== null? i.valor : 0;
          const vlr1 = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(num1);
            let ordem = proxData.substring(0, 10);
            ordem = ordem.substring(6,9) +  ordem.substring(3,4) + ordem.substring(0,1) + i.horario
            let prof = i.profis !== undefined && i.profis !== null ? i.profis : '-'
            prof = prof.length > 15 ? prof.substring(0,12) + '...' : prof;
            let recibo = '-'
            let dadopagto = ''
            let saldo = 0;
            for (let l of fin){
              if (l.refAgenda == i.id?.toString()){
                recibo = recibo + l.recibo;
                const vlr = l.valor !== undefined && l.valor !== null ? l.valor : 0;
                let d = l.data;
                d = d.substring(8,10) + '/' + d.substring(5,7) + '/' + d.substring(0,4)
                const dadopg = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(vlr) + '-' + d;
                dadopagto = dadopagto + dadopg + '-'
                saldo = saldo + l.saldo;
              }
            }
          const lin: TableFin = {
            id: n,
            idAgenda: i.id !== undefined ? i.id : 0,
            idFinanceiro: 0,
            selecionada: false,
            dia: proxData,
            hora: i.horario !== undefined ? i.horario : '-',
            servico: i.subtitulo !== undefined ? i.subtitulo : '-',
            profis: prof,
            valor: num1,
            multi: i.multi,
            pago: saldo,
            dtPago: dadopagto,
            recibo: recibo,
            descricao: 'string',
            presenca: i.status !== undefined ? i.status : '---',
            ordem: ordem !== undefined ? ordem : '',
          }
          let verif = false
          for (let x of this.finService.tabFinanceira){
            if (lin.dia == x.dia
              && lin.hora == x.hora){
                if (lin.id > x.id){
                  x = lin
                }
                verif = true
              }
          }

          if (verif == false){
            n += 1
            this.finService.tabFinanceira.push(lin)
            this.totalValor += lin.valor;
            this.totalPagto += lin.pago;
          }
        }
        for (let l of fin){
          if (l.refAgenda == 'pg'){
            let d = l.data;
                d = d.substring(8,10) + '/' + d.substring(5,7) + '/' + d.substring(0,4)
            const lin: TableFin = {
              id: n,
              idAgenda: 0,
              idFinanceiro: l.id !== undefined ? l.id : 0,
              selecionada: false,
              dia: d,
              hora: '-',
              servico: l.descricao,
              profis: '-',
              valor: l.valor !== null ? l.valor : 0,
              multi: '-',
              pago: l.saldo,
              dtPago: new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(l.saldo) + ' (saldo)',
              recibo: l.recibo,
              descricao: l.descricao,
              presenca: '---',
              ordem: 'PG' + new Date().toISOString(),
            }
            n += 1
            this.finService.tabFinanceira.push(lin)
            this.totalPagto += lin.pago;
          }
        }
        this.finService.tabFinanceira.sort((a, b) => a.ordem.localeCompare(b.ordem));
        this.totalRegistros = n;
        this.diferenca = this.totalValor - this.totalPagto
    }
  }


private semana = '-'

calcDia(dia0: string, valid: string): boolean{
  const val = valid.split('%')
  let resp = true;
  const dia = new Date(dia0).toISOString().split('T')[0]
  const diaDaSemana = new Date(dia).getDay();
  const diasDaSemana = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  this.semana = diasDaSemana[diaDaSemana];
  const pi = this.agenda.calcSemanaSimNao(dia)  =='P' ? 'P' : 'I';
  switch (val[0]){
    case 'S':
      resp = val[1] == this.semana ? true : false;
      break;
    case 'Q':
      resp = val[1] == this.semana && pi == val[2] ? true : false;
      break;
    default:
      resp = true
      break;
  }
  return resp
}






  async BuscaValores(){
    let data = 'nada por enquanto 2'
    try{
      data = await this.shared.BuscaValores();
      //const retorno001 = await this.finService.getFinanceiroById(this.finService.nCliente);

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

      // let valorOriginal = parseFloat(this.finService.info_Valor.replace(/[^\d,]/g, '').replace(',', '.'));
      // let valorPagto = parseFloat(this.finService.info_GeraPagto.replace(/[^\d,]/g, '').replace(',', '.'));
      // let origNumerico: number = !Number.isNaN(valorOriginal) ? valorOriginal : 0;
      // let pagtoNumerico: number = !Number.isNaN(valorPagto) ? valorPagto : 0;

      // if (origNumerico > 0 && pagtoNumerico == 0){
      //   this.finService.info_GeraPagto = this.finService.info_Valor
      //   let dt =  new Date().toISOString();
      //   dt = dt.substring(0,10)
      //   let dt2 = dt.split('-')
      //   dt = dt2[2] + '/' + dt2[1] + '/' + dt2[0]
      //   this.finService.info_DataAt = dt;
      // }
    }
  }







  async Enviar(){
    if(this.finService.MostraInfo == false){
      alert ('Não há nada a ser salvo por enquanto...')
    }else{

      // if(this.finService.idLinha){
      //   const result = await this.finService.updateFinanceiro(dado)
      //   const id = this.finService.Atual.id !== undefined ? this.finService.Atual.id : 0;
      //   //this.finService.getFinanceiroById(id)
      //   alert('Dados atualizados!')
      //   this.router.navigate(['/controleFinaceiro']);
      // }else{
      //   const result = await this.finService.createFinanceiro(dado)
      //   const id = this.finService.Atual.id !== undefined ? this.finService.Atual.id : 0;
      //   //this.finService.getFinanceiroById(id)
      //   alert('Dados inseridos com sucesso!')
      //   this.router.navigate(['/controleFinaceiro']);
      // }
    }
  }



 ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}


