export interface Cliente{
  id?: number; //
  nome: string; //
  foto?: string;
  saiSozinho: boolean; //
  dtInclusao?: any;
  clienteDesde?: any;
  ativo: boolean;
  areaSession: string;
  respFinanc: string; //
  cpf: string;//
  identidade: string; //
  dtNascim?: any; //
  celular: string;  //
  telFixo: string;//
  telComercial?: string;//
  email: string;//
  endereco: string;//

  mae: string;
  maeRestric: boolean;
  maeIdentidade: string;
  maeCpf: string;
  maeCelular: string;
  maeTelFixo: string;
  maeTelComercial: string;
  maeEmail: string;
  maeEndereco: string;

  pai: string;
  paiRestric: boolean;
  paiIdentidade: string;
  paiCpf: string;
  paiCelular: string;
  paiTelFixo: string;
  paiTelComercial: string;
  paiEmail: string;
  paiEndereco: string;
}

