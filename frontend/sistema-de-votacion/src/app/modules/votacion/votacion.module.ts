import { EleccionComponent } from './components/eleccion/eleccion.component';
import { CandidatosComponent } from './components/candidatos/candidatos.component';
import { VotantesComponent } from './components/votantes/votantes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotacionComponent } from './votacion.component';
import { VotacionRoutingModule } from './votacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    VotacionRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    VotacionComponent,
    VotantesComponent,
    CandidatosComponent,
    EleccionComponent
  ]
})
export class VotacionModule { }
