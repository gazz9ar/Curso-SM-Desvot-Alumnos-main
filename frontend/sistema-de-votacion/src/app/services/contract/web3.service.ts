
import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { provider } from 'web3-core';
import * as contractABI from '../../../../../../smart-contract/build/contracts/Election.json';
import { AlertsService } from '../alerts/alerts.service';
import { map }  from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public accountsObservable = new Subject<string[]>();
  web3Modal;
  web3js:  any;
  provider: provider | undefined | any;
  accounts: string[] | undefined;
  balance: string | undefined;
  currentWallet:string = '';

  public currentWalletSubject:Subject<string> = new Subject<string>();
  public currentWalletOb$:Observable<string> = this.currentWalletSubject.asObservable();

  public winnerSubject:Subject<string> = new Subject<string>();
  public winnerOb$:Observable<string> = this.winnerSubject.asObservable();

  public totalEthSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalEthOb$:Observable<number> = this.totalEthSubject.asObservable();
  public totalContractBalance:number = 0;
 

  constructor(private alertService:AlertsService) {
    const providerOptions = {
      injected: {
        display: {
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          name: 'metamask',
          description: "Connect with the provider in your Browser"
        },
        package: null
      },
      walletconnect: {
        package: WalletConnectProvider, // required | aqui importamos el paquete que nos ayudara a usar soportar distintas wallets
        options: {
          infuraId: 'env', // cambia esto con tu apikey de infura
          description: 'Scan the qr code and sign in', // Puedes camnbiar los textos descriptivos en la seccion description
          qrcodeModalOptions: {
            mobileLinks: [
              'rainbow',
              'metamask',
              'argent',
              'trust',
              'imtoken',
              'pillar'
            ]
          }
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "Ganache", // puedes cambiar a una red de pruebas o etc
      cacheProvider: false, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });

    this.watchForContractBalance();
  }

  public watchForContractBalance(): void {
    this.totalEthOb$.subscribe(
      totalBalance => {
        this.totalContractBalance = totalBalance;
      }
    )
  }
  public async connectAccount(): Promise<provider | undefined> {
    window.ethereum.on('accountsChanged', (accounts:any) => {
      this.currentWalletSubject.next(accounts[0]);
    })
    try {
      this.provider = await this.web3Modal.connect(); // set provider
      if (this.provider) {
        this.web3js = new Web3(this.provider);
        this.web3js.eth.requestAccounts().then((acc:any) => {
          this.currentWalletSubject.next(acc[0]);     
          this.currentWallet = acc[0];   
        });
      } // create web3 instance
    } catch (error) {
      console.log(error)
    }
    return this.web3js;
  }

  public async connectContract(): Promise<any>{
    let contract: any = null;
    const direccionDelContrato = contractABI.networks[5777].address;
    try {
      contract = new this.web3js.eth.Contract(contractABI.abi, direccionDelContrato);
    } catch (error) {
      console.error(error)
    }
    return contract;
  }
  
  //TODO: validar la instancia del contrato;
  public async payFee(direccionWallet: string): Promise<string | null>{
    const contract = await this.connectContract();
    const addC = await contract.methods.payFee().send({from: direccionWallet, value: 1000000000000000000});
    if(addC?.transactionHash){
      return addC;
    }
    return null;
  }

  public async agregarCandidato(direccionWallet: string, nombre: string, contractOwner: string): Promise<any>{
    const contract = await this.connectContract();
    const candidatoAgregado = await contract.methods.addCandidate(direccionWallet, nombre).send({from: contractOwner});
    return candidatoAgregado;
  }

  public async getContractOwner(): Promise<any> {
    const contract = await this.connectContract();
    const ad = await contract.methods.owner().call();
    return ad;
  }

  public async consultarCantidadDeCandidatos() {
    let totalCandidatos: any = null;
    const contract = await this.connectContract();
    try {
      totalCandidatos = await contract.methods.getTotalCandidate().call();
    } catch (error) {
      this.alertService.checkError((error as any).message)
    }
    return totalCandidatos;
  }

  public async registrarVotante(direccionWallet: string, contractOwner: string): Promise<any> {
    const contract = await this.connectContract();
    const votanteRegistrado = await contract.methods.registerVoter(direccionWallet).send({from: contractOwner});
    return votanteRegistrado;
  }

  public async iniciarVotacion(owner: string): Promise<void> {
    let votation: any = null;
    const contract = await this.connectContract();
    try {
      votation = await contract.methods.startVote().send({from: owner});
    } catch (error) {     
      this.alertService.checkError((error as any).message);
    }
    return votation
  }

  public async finalizarVotacion(owner: string): Promise<void> {
    let votation: any = null;
    const contract = await this.connectContract();
    try {
      votation = await contract.methods.endVote().send({from: owner});
      
    } catch (error) {
      this.alertService.checkError((error as any).message)
    }
    return votation
  }

  public async givePriceToWinner(owner:string): Promise<any> {   

    this.connectAccount().then(
      acc => {
        this.connectContract()
        .then(
            (contract) => {     
              const result = contract.methods.givePriceToWinner().send({from: owner});          
              return result;             
            }
        )
        .catch(
          err => {
            return err;        
          }
        );
      }
    )
   
  }

  public async consultarEstadoVotacion(): Promise<any> {
    let stateVotation: any = null;
    const contract = await this.connectContract();
    try {
      stateVotation = await contract.methods.state().call();
    } catch (error) {
      this.alertService.checkError((error as any).message)
    }
    return stateVotation;
  }

  public async anunciarGanador(owner: string): Promise<any> {
    let ganador: any = null;
    const contract = await this.connectContract();
    try {
      ganador = await contract.methods.announceWinner().call({from: owner});
      this.winnerSubject.next(ganador);
    } catch (error) {
      this.alertService.checkError((error as any).message)
    }
    return ganador;
  }

  public async votar(direccionCandidato: string, direccionVotante: string): Promise<any> {
    let voto: any = null;
    const contract = await this.connectContract();
    try {
      voto = await contract.methods.vote(direccionCandidato).send({from: direccionVotante});
    } catch (error) {
      this.alertService.checkError((error as any).message)
    }
    return voto;
  }

  public async getContractBalance(): Promise<any> {
    this.connectContract().then(
      (contract) => {
        try {
          contract.methods.getContractBalance().call().then(
            (contractBalance:any) => {                       
              this.totalEthSubject.next(this.web3js.utils.fromWei(contractBalance,'ether'));
            }
          );         
        } catch (error) {
          this.alertService.checkError((error as any).message);
        }
      }
    );   
  }

}
