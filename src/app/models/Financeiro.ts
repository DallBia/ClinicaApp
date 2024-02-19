export interface Financeiro{

  id: number;
  idCliente: number;
  idFuncAlt: number;
  nome: string;
  data: string;
  descricao: string;
  valor: number | null;
  saldo: number;
  selecionada: boolean;
  recibo: string;
  refAgenda: string;
}
