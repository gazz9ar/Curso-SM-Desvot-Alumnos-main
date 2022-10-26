import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

constructor(private firestore: AngularFirestore) { }

public obtenerPrecandidatos(): Promise<any> {
  return new Promise<any>( (resolve) => {
    this.firestore.collection('precandidatos').valueChanges().subscribe(cuentas => resolve(cuentas));
  });
}

public obtenerCandidatos(): Promise<any> {
  return new Promise<any>( (resolve) => {
    this.firestore.collection('candidatos').valueChanges().subscribe(cuentas => resolve(cuentas));
  });
}

public async obtenerPrecandidatosEleccion(contractAddress: string): Promise<any[]>{
  let cuentasEleccion: Array<any> = [];
  const cuentas: Array<any> = await this.obtenerPrecandidatos();
  cuentas.forEach( (c) => {
    if (c.direccionContrato == contractAddress){ 
      cuentasEleccion.push(c);
    }
  });
  return cuentasEleccion;
}

public async obtenerCandidatosEleccion(contractAddress: string): Promise<any[]>{
  let cuentasEleccion: Array<any> = [];
  const cuentas: Array<any> = await this.obtenerCandidatos();
  cuentas.forEach( (c) => {
    if (c.direccionContrato == contractAddress){
      cuentasEleccion.push(c);
    }
  });
  return cuentasEleccion;
}


public agregarPreCandidato(direccionContrato: string | undefined, direccionCuenta: any): void {
  this.firestore.collection('precandidatos').doc().set({direccionCuenta, direccionContrato});
}

public agregarCandidato(direccionContrato: string | undefined, direccionCuenta: any): void {
  this.firestore.collection('candidatos').doc().set({direccionCuenta, direccionContrato});
}

}
