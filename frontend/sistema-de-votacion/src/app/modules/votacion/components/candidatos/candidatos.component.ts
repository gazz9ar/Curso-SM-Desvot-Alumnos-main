import { FirebaseService } from '../../../../services/firebase/firebase.service';
import { AlertsService } from './../../../../services/alerts/alerts.service';
import { Web3Service } from 'src/app/services/contract/web3.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Bloque } from 'src/app/models/bloque.model';
import * as contractABI from '../../../../../../../../smart-contract/build/contracts/Election.json';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {

  cuentasHabilitadas: Array<any> = [];
  cuentasHControl: FormControl = new FormControl();
  nombreControl: FormControl = new FormControl();
  direccionContrato: string = contractABI.networks[5777].address;

  constructor(private web3Service: Web3Service,
              private alertsService: AlertsService,
              private firebaseService: FirebaseService) {
  }

  async ngOnInit() {
    this.cuentasHabilitadas = await this.firebaseService.obtenerPrecandidatosEleccion(this.direccionContrato);
  }

  public async pagarFee(): Promise<void>{
    
    let result: Bloque | any = null;
    const cuentaPersonal: any = await this.web3Service.connectAccount();    
    const direccionDeCuenta = cuentaPersonal.currentProvider.selectedAddress;
    try {
      result = await this.web3Service.payFee(direccionDeCuenta);
      this.updateContractBalance();
    } catch (error: any) {
      this.alertsService.mostrarAlertaError(error);
    }
    if (result) {
      this.alertsService.mostrarAlertaExito(JSON.stringify(result, undefined, '\t'));
      this.firebaseService.agregarPreCandidato(this.direccionContrato, direccionDeCuenta);
    }
  }

  public updateContractBalance(): void {
    this.web3Service.getContractBalance();
  }

  public async agregarCandidato(): Promise<void>{
    let result: Bloque | any = null;
    await this.web3Service.connectAccount();
    const ownerAddress = await this.web3Service.getContractOwner();
    try {
      result = await this.web3Service.agregarCandidato(this.cuentasHControl.value, this.nombreControl.value, ownerAddress);
    } catch (error: any) {
      await this.alertsService.mostrarAlertaError(error);
    }
    if(result){
      this.firebaseService.agregarCandidato(this.direccionContrato, this.cuentasHControl.value);
      this.alertsService.mostrarAlertaExito(JSON.stringify(result, undefined, '\t'));
    }
  }

  public async refrescarCuentas(): Promise<void>{
    this.cuentasHabilitadas = await this.firebaseService.obtenerPrecandidatosEleccion(this.direccionContrato);
  }

}
