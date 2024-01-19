export interface Agenda{

  id?: number;
  idCliente?: number; //
  nome?: string;
  idFuncAlt?: number; //
  dtAlt?: string; //
  horario?: string; //
  sala?: number; //
  unidade?: number; //
  diaI?: string;
  diaF?: string; //
  diaDaSemana?: string; //
  repeticao?: string; //
  subtitulo?: string;
  status?: string;
  historico?: string; //
  obs?: string;
  valor?: number | null;
  configRept: string;
  multi?: string;
  profis?:string;

}
