import deipRpc from '@detechworld/rpc-client';
import { Singleton } from '@detechworld/toolbox';
import { ResearchNdaHttp } from './ResearchNdaHttp';
import { ProposalsService } from '@detechworld/proposals-service';
import { BlockchainService } from '@detechworld/blockchain-service';

class ResearchNdaService extends Singleton {
  researchNdaHttp = ResearchNdaHttp.getInstance();
  proposalsService = ProposalsService.getInstance();
  blockchainService = BlockchainService.getInstance();

  createResearchNda({ privKey, username }, {
    creator,
    parties,
    description,
    researchExternalId,
    startTime,
    endTime,
    extensions,
    requestEndTime,
    approvers
  }) {

    const offchainMeta = {};
    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const [research_nda_external_id, create_research_nda_op] = deipRpc.operations.createEntityOperation(['create_research_nda', {
          creator: creator,
          parties: parties,
          description: description,
          researches: [researchExternalId],
          start_time: startTime,
          end_time: endTime,
          extensions: extensions
        }], refBlock);

        const proposal = {
          creator: username,
          proposedOps: [{ "op": create_research_nda_op }],
          expirationTime: requestEndTime,
          reviewPeriodSeconds: undefined,
          extensions: [],
          approvers: approvers
        }

        return this.proposalsService.createProposal({ privKey, username }, false, proposal, refBlock)
          .then(({ tx: signedProposalTx }) => {
             return this.researchNdaHttp.createResearchNda({ tx: signedProposalTx, offchainMeta })
          })
      });
  }

  getResearchNda(externalId) {
    return this.researchNdaHttp.getResearchNda(externalId);
  }

  getResearchNdaListByCreator(creator) {
    return this.researchNdaHttp.getResearchNdaListByCreator(creator);
  }

  getResearchNdaListByResearch(researchExternalId) {
    return this.researchNdaHttp.getResearchNdaListByResearch(researchExternalId);
  }
}

export {
  ResearchNdaService
};
