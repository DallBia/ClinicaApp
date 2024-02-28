export interface TableFin{
  id: number,
  idAgenda: number,
  idFinanceiro: number,
  idCliente: number,
  selecionada: boolean,
  dia: string,
  hora: string,
  servico: string,
  profis: string,
  valor: number,
  pago: number,
  dtPago: string,
  recibo: string,
  descricao: string,
  presenca: string,
  multi?: string,
  ordem: string,
}
