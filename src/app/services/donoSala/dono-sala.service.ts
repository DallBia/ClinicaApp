import { DonoSala } from './../../models/DonoSalas';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteService } from '../cliente/cliente.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { AgendaService } from '../agenda/agenda.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Agenda } from 'src/app/models/Agendas';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/Response';
import { Agenda2Service } from '../agenda/agenda2.service';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';


@Injectable({
  providedIn: 'root'
})




export class DonoSalaService {
  //  public dono!: DonoSala[];
  public dono: BehaviorSubject<DonoSala[]> = new BehaviorSubject<DonoSala[]>([]);
  dono$: Observable<DonoSala[]> = this.dono.asObservable();
  setDono(novoValor: DonoSala[]): void {
    this.dono.next(novoValor);
  }

private donoV: DonoSala[] = []
private donoA: DonoSala = {
  id: 0,
  unidade: 0,
  configRept: 'X',
  sala: 0,
  idProfissional: 0,
  area: '',
  diaSemana: '',
  dataInicio: new Date().toISOString().split('T')[0],
  dataFim: undefined,
  periodo: '',
}
private success: boolean = false;




  constructor(private http: HttpClient,
              ) {

              }

  async Donos(){
    // this.dono = [];
    // this.nVezes += 1;
    // console.log('Em clienteService: ' + this.nVezes)
      try {
        const data = await this.GetDonos();

        const dados = data.dados;
        dados.map((item: DonoSala) => {
          item.dataInicio !== null ? item.dataInicio = new Date(item.dataInicio!).toLocaleDateString('pt-BR') : '---'
          item.dataFim !== null ? item.dataFim = new Date(item.dataFim!).toLocaleDateString('pt-BR') : '---'
          });

          let dono: DonoSala[] = data.dados;
          dono.sort((a, b) => a.dataInicio.localeCompare(b.dataInicio));

        this.setDono(dono);
        this.success = data.sucesso;
        return true;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return false;
      }
    }

    buscaDonos(){
      const r = this.Donos();
    }


    private apiurl = `${environment.ApiUrl}/DonoSala`
    GetDonos(): Promise<any> {
     return this.http.get<any>(`${this.apiurl}`).toPromise();
   }


}
