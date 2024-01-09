export interface Colaborador{

    id?: number;
    nome: string;
    dtNasc?: string;
    rg?: string;
    cpf?: string;
    endereco?: string;
    telFixo?: string;
    celular?: string;
    email: string;
    dtAdmis?: string;
    dtDeslig?: string;
    idPerfil?: number;
    ativo?: boolean;
    areaSession?: string;
    senhaHash: string;
    senhaProv?: string;
    foto?: string;
}
