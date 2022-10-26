import { Web3Service } from 'src/app/services/contract/web3.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {finalize,takeUntil} from 'rxjs/operators'


@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit {

  currentWalletOb?:Observable<string>;
  totalEther?:Observable<number>;
  winner?:Observable<string>;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {   
    this.setUpCurrentWallet();   
  }   

  setUpCurrentWallet(): void {
    this.web3Service.currentWalletOb$  
    .subscribe(
      (wallet) => {
        this.setUpCurrentContractBalance();
        this.setUpWinner();
      }
    )
    this.currentWalletOb = this.web3Service.currentWalletOb$;
  }

  setUpCurrentContractBalance(): void {    
    this.web3Service.getContractBalance();
    this.totalEther = this.web3Service.totalEthOb$;   
  }

  setUpWinner(): void {
    this.winner = this.web3Service.winnerOb$;
  }

  public async conectarWallet() {
    const result = await this.web3Service.connectAccount();
    console.log(result)
  }

}
