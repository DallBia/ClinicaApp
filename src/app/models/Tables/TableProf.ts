import { Formacao } from "../Formacaos";

export interface TableProf {
  foto: string;
  ficha: string;
  id?: number;
  nome: string;
  nascimento: any;
  area: string;
  selecionada: boolean;
  desde: any;
  proxses?: any;
  celular?: string;
  telFixo?: string;
  identidade? : string;
  cpf? : string;
  endereco? : string;
  email? : string;
  ativo? : boolean;
  perfil? : string;
  formacao? : Formacao[];

}
