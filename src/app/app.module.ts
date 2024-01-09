
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CadprofComponent } from './pages/cadprof/cadprof.component';
import { FichaclienteComponent } from './pages/fichacliente/fichacliente.component';
import { ProtadmComponent } from './pages/protadm/protadm.component';
import { ProtclinComponent } from './pages/protclin/protclin.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDateComponent } from '../app/sharepage/custom-date/custom-date.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ConverterDiaSemanaParaPortuguesPipe } from '../app/sharepage/custom-date/converter-dia-semana-para-portugues.pipe'; // Ajuste o caminho
import { ReactiveFormsModule } from '@angular/forms'; // Importe ReactiveFormsModule
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ControleFinaceiroComponent } from './pages/controle-finaceiro/controle-finaceiro.component';
import { MeuBotaoComponent } from './sharepage/meu-botao/meu-botao.component';
import { ContainerComponent } from './sharepage/container/container.component';
import { InputComponent } from './sharepage/input/input.component';
import { FormularioComponent } from './sharepage/formulario/formulario.component';
import { TextboxComponent } from './sharepage/textbox/textbox.component';
import { LoginComponent } from './pages/login/login.component';
import { CelAgendaComponent } from './sharepage/cel-agenda/cel-agenda.component';
import { Grid01Component } from './sharepage/grid01/grid01.component';
import { FormClienteComponent } from './sharepage/form-cliente/form-cliente.component';
import { FormsComponent } from './sharepage/forms/forms.component';
import { ContainerFormsComponent } from './sharepage/container-forms/container-forms.component';
import { DateMaskDirective } from './date-mask.directive';
import { BlocoNotasComponent } from './sharepage/bloco-notas/bloco-notas.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { RequestInterceptor } from '../app/pages/login/request.interceptor';
import { ClienteService } from './services/cliente/cliente.service';
import { UserService } from './services/user.service';
import { DefinitionsComponent } from './pages/definitions/definitions.component';
import { PerfilTabComponent } from './sharepage/perfil-tab/perfil-tab.component';
import { UnidadeComponent } from './sharepage/unidade/unidade.component';
import { DadosformComponent } from './sharepage/dadosform/dadosform.component';
import { RouterModule } from '@angular/router';
import { Grid02Component } from './sharepage/grid02/grid02.component';
import { FormProntComponent } from './sharepage/form-pront/form-pront.component';
import { ModalComponent } from './sharepage/forms/modal/modal.component';
import { EquipeModalComponent } from './pages/cadprof/equipe-modal/equipe-modal.component';
import { DetalhesComponent } from './sharepage/detalhes/detalhes.component';
import { FiltroComponent } from './sharepage/filtro/filtro.component';
import { ModalSenhaProvComponent } from './pages/login/modal-senha-prov/modal-senha-prov.component';
import { NavbarService } from './sharepage/navbar/navbar.service';
import { ArquivosComponent } from './sharepage/arquivos/arquivos.component';
import { CurrencyInputDirective } from './currency-input.directive';
import { PdfModalComponent } from './sharepage/form-pront/pdf-modal/pdf-modal.component';
import { TabFinComponent } from './sharepage/tab-fin/tab-fin.component';
import { TabValoresComponent } from './sharepage/tab-valores/tab-valores.component';
import { Agenda2Component } from './pages/agenda2/agenda2.component';
import { AgendaCellComponent } from './sharepage/agenda-cell/agenda-cell.component';
import { AgendaMenuComponent } from './sharepage/agenda-menu/agenda-menu.component';
import { ModalMultiComponent } from './sharepage/agenda-menu/modal-multi/modal-multi.component';
import { ModalArquivoComponent } from './sharepage/arquivos/modal-arquivo/modal-arquivo.component';
import {MeuModalComponent} from './pages/fichacliente/meu-modal/meu-modal.component';
import { ModalConfirComponent } from './sharepage/modal-confir/modal-confir.component';

registerLocaleData(localePt);

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [

    AppComponent,
    NavbarComponent,
    HomeComponent,
    AgendaComponent,
    CadprofComponent,
    FichaclienteComponent,
    ProtadmComponent,
    ProtclinComponent,
    CustomDateComponent,
    ConverterDiaSemanaParaPortuguesPipe,
    ControleFinaceiroComponent,
    ContainerComponent,
    InputComponent,
    FormularioComponent,
    TextboxComponent,
    LoginComponent,
    CelAgendaComponent,
    MeuBotaoComponent,
    Grid01Component,
    FormClienteComponent,
    FormsComponent,
    ContainerFormsComponent,
    BlocoNotasComponent,
    DefinitionsComponent,
    PerfilTabComponent,
    UnidadeComponent,
    DadosformComponent,
    Grid02Component,
    FormProntComponent,
    ModalComponent,
    EquipeModalComponent,
    DetalhesComponent,
    FiltroComponent,
    ModalSenhaProvComponent,
    ArquivosComponent,
    CurrencyInputDirective,
    PdfModalComponent,
    DateMaskDirective,
    TabFinComponent,
    TabValoresComponent,
    Agenda2Component,
    AgendaCellComponent,
    AgendaMenuComponent,
    ModalMultiComponent,
    ModalArquivoComponent,
    MeuModalComponent,
    ModalConfirComponent,
  ],


imports: [
  FormsModule,
  HttpClientModule,
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  FormsModule,
  BrowserAnimationsModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  ReactiveFormsModule,
  MatDialogModule,
  MatButtonModule,
  FormsModule,
  HttpClientModule,
  // JwtModule.forRoot({
  //   config: {
  //     tokenGetter: tokenGetter,
  //     allowedDomains: ['https://localhost:7298/api'],
  //     disallowedRoutes: [],
  //   },
  // }),
 ],
  providers: [BrowserModule, FormsModule,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true
      },

    ],
  bootstrap: [AppComponent]

})
export class AppModule {

 }
