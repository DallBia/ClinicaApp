export interface TableData {
  foto: string;
  Ficha: string;
  selecionada: boolean;
  Proxses?: any;

  id?: number;
  nome: string;
  dtNascim: any;
  saiSozinho: string;
  ativo? : boolean;
  areaSession: string;
  clienteDesde: any;
  Idade: string;
  dtInclusao? : any;
  respFinanc? : string;
  identidade? : string;
  cpf?: string;
  endereco? : string;
  email? : string;
  telFixo?: string;
  celular?: string;
  telComercial?: string;

  mae? : string;
  maeRestric? : string;
  maeIdentidade? : string;
  maeCpf?: string;
  maeEndereco? : string;
  maeEmail? : string;
  maeTelFixo?: string;
  maeCelular?: string;
  maeTelComercial?: string;

  pai? : string;
  paiRestric? : string;
  paiIdentidade? : string;
  paiCpf?: string;
  paiEndereco? : string;
  paiEmail? : string;
  paiTelFixo?: string;
  paiCelular?: string;
  paiTelComercial?: string;

}

