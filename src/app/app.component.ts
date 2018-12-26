import { Component } from '@angular/core';
import * as Web3 from 'web3';
import { Config } from './helpers/config';
import { electionContractAbi } from './helpers/election-contract-abi';
declare var web3;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    candidates = [];

    private web3: any;
    private electionContract: any;
    private message = "";

    constructor() {
        if (typeof web3 != 'undefined') {
            this.web3 = new Web3(web3.currentProvider);
        } else {
            this.web3 = new Web3(new Web3.providers.HttpProvider(Config.blockchainUrl));
        }
        this.electionContract = new this.web3.eth.Contract(electionContractAbi, Config.electionContractAddr);
        console.log(this.electionContract);
        this.getCandidates();
    }

    async getCandidates() {
        let totalCandidates = await this.electionContract.methods.candidatesCount().call();
        for (let candidateIdx = 0; candidateIdx < totalCandidates; candidateIdx++) {
            let candidate = await this.electionContract.methods.candidates(candidateIdx).call();
            console.log(candidate);
            this.candidates[candidateIdx] = candidate;
        }
    }

    async voteCandidate(candidateId: number) {
        try {
            let result = await this.electionContract.methods.voteACandidate(candidateId).send({
                from: this.web3.currentProvider.selectedAddress
            });
            this.getCandidates();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    async addCandidate(candidateName: string) {
        try {
            let result = await this.electionContract.methods.addCandidate(candidateName).send({
                from: this.web3.currentProvider.selectedAddress
            });
            console.log(result);
            this.getCandidates();
        } catch (err) {
            console.log(err);
        }
    }

    async addVoter(address: string) {
        try {
            let result = await this.electionContract.methods.addVoter(address).send({
                from: this.web3.currentProvider.selectedAddress
            });
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }
}
