import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Bloque } from 'src/app/models/bloque.model';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { Web3Service } from 'src/app/services/contract/web3.service';
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import * as contractABI from '../../../../../../../../smart-contract/build/contracts/Election.json';

@Component({
  selector: 'app-votantes',
  templateUrl: './votantes.component.html',
  styleUrls: ['./votantes.component.css']
})
export class VotantesComponent implements OnInit {

  cuentas: Array<string> = [];
  cuentasHabilitadas:  Array<any> = [];
  cuentasControl: FormControl = new FormControl();
  cuentasHControl: FormControl = new FormControl();
  direccionVotante: FormControl = new FormControl();
  direccionContrato: string = contractABI.networks[5777].address;

  constructor(private web3Service: Web3Service,
              private alertsService: AlertsService,
              private firebaseService: FirebaseService) { }

  async ngOnInit() {
    this.cuentasHabilitadas = await this.firebaseService.obtenerCandidatosEleccion(this.direccionContrato);
  }

  public async registrarVotante(): Promise<void>{
    let result: Bloque | any = null;
    const ownerAddress = await this.web3Service.getContractOwner();
    try {
      result = await this.web3Service.registrarVotante(this.direccionVotante.value, ownerAddress);
    } catch (error: any) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (result) {
      this.alertsService.mostrarAlertaExito(JSON.stringify(result, undefined, '\t'));
    }
  }

  public async refrescarCuentas(){
    this.cuentasHabilitadas = await this.firebaseService.obtenerCandidatosEleccion(this.direccionContrato);
  }

  public async votar(){
    let result: Bloque | any = null;
    const cuentaPersonal: any = await this.web3Service.connectAccount();
    const direccionDeCuenta = cuentaPersonal.currentProvider.selectedAddress;
    try {
      result = await this.web3Service.votar(this.cuentasHControl.value, direccionDeCuenta)
    } catch (error: any) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (result){
      this.alertsService.mostrarAlertaExito(JSON.stringify(result, undefined, '\t'));
    }
  }

}
