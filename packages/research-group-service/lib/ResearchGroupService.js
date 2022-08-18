import deipRpc from '@detechworld/rpc-client';
import crypto from '@detechworld/lib-crypto';
import { Singleton } from '@detechworld/toolbox';
import { AccessService } from '@detechworld/access-service';
import { BlockchainService } from '@detechworld/blockchain-service';
import { ProposalsService } from '@detechworld/proposals-service';
import { ResearchGroupHttp } from './ResearchGroupHttp';
import { UsersService } from '@detechworld/users-service';

const proposalExpiration = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ResearchGroupService extends Singleton {
  researchGroupHttp = ResearchGroupHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

  proposalsService = ProposalsService.getInstance();

  usersService = UsersService.getInstance();

  _mapResearchGroup(rg) {
    return { ...rg };
  }

  createResearchGroup(privKey, {
    fee,
    creator,
    accountOwnerAuth,
    accountActiveAuth,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  }, {
    researchGroupName,
    researchGroupDescription,
    researchGroupThresholdOverrides
  }) {
    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {
        const offchainMeta = {
          researchGroup: {
            name: researchGroupName,
            description: researchGroupDescription
          }
        };

        const [research_group_external_id, create_account_op] = deipRpc.operations.createEntityOperation(['create_account', {
          fee,
          creator,
          owner: accountOwnerAuth,
          active: accountActiveAuth,
          active_overrides: researchGroupThresholdOverrides,
          memo_key: accountMemoPubKey,
          json_metadata: accountJsonMetadata,
          traits: [[
            'research_group',
            {
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.researchGroup)).buffer)),
              extensions: []
            }
          ]],
          extensions: accountExtensions
        }], refBlock);


        return this.blockchainService.signOperations([create_account_op], privKey, refBlock)
          .then((signedTx) => this.researchGroupHttp.createResearchGroup({ tx: signedTx, offchainMeta }));
      });
  }


  updateResearchGroupAccount({ privKey, username }, isProposal, {
    researchGroup,
    accountOwnerAuth,
    accountActiveAuth,
    accountActiveAuthOverrides,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  }, {
    researchGroupName,
    researchGroupDescription
  }) {
    const offchainMeta = { researchGroup: { name: researchGroupName, description: researchGroupDescription } };

    const update_account_op = ['update_account', {
      account: researchGroup,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      active_overrides: accountActiveAuthOverrides,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: [[
        'research_group',
        {
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(offchainMeta.researchGroup)).buffer)),
          extensions: []
        }
      ]],
      extensions: accountExtensions
    }];


    if (isProposal) {
      const proposal = {
        creator: username,
        proposedOps: [{ op: update_account_op }],
        expirationTime: proposalExpiration,
        reviewPeriodSeconds: undefined,
        extensions: []
      };

      return this.proposalsService.createProposal({ privKey, username }, false, proposal)
        .then(({ tx: signedProposalTx }) => this.researchGroupHttp.updateResearchGroup({ tx: signedProposalTx, offchainMeta, isProposal }));
    }

    return this.blockchainService.signOperations([update_account_op], privKey)
      .then((signedTx) => this.researchGroupHttp.updateResearchGroup({ tx: signedTx, offchainMeta, isProposal }));
  }

  createResearchGroupInvite({ privKey, username }, {
    member,
    researchGroup,
    rewardShare,
    researches,
    extensions
  }, { notes }) {
    const offchainMeta = { notes };

    const join_research_group_membership_op = ['join_research_group_membership', {
      member,
      research_group: researchGroup,
      reward_share: rewardShare,
      researches,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ op: join_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    };

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => this.researchGroupHttp.createResearchGroupInvite({ tx: signedProposalTx, offchainMeta }));
  }

  leaveResearchGroup(
    { privKey, username },
    {
      member,
      researchGroup,
      isExclusion,
      extensions
    },
    {
      notes
    }
  ) {
    const offchainMeta = { notes };

    const leave_research_group_membership_op = ['leave_research_group_membership', {
      member,
      research_group: researchGroup,
      is_exclusion: isExclusion,
      extensions
    }];

    const proposal = {
      creator: username,
      proposedOps: [{ op: leave_research_group_membership_op }],
      expirationTime: proposalExpiration,
      reviewPeriodSeconds: undefined,
      extensions: []
    };

    return this.proposalsService.createProposal({ privKey, username }, false, proposal)
      .then(({ tx: signedProposalTx }) => this.researchGroupHttp.leaveResearchGroup({ tx: signedProposalTx, offchainMeta }));
  }

  getResearchGroupPendingInvites(researchGroupExternalId) {
    return this.researchGroupHttp.getResearchGroupPendingInvites(researchGroupExternalId);
  }

  getResearchGroup(teamId) {
    return Promise.all([
      this.researchGroupHttp.getResearchGroup(teamId),
      this.usersService.getUsersByResearchGroup(teamId)
    ]).then(([group, members]) => ({
      ...group,
      members
    }));
  }

  getResearchGroups(externalIds) {
    return Promise.all(externalIds.map((externalId) => this.getResearchGroup(externalId)));
  }

  getResearchGroupsListing(personal = false) {
    return this.researchGroupHttp.getResearchGroupsListing(personal);
  }

  getTeamsByUser(user) {
    return this.researchGroupHttp.getTeamsByUser(user)
  }

  getResearchGroupsByTenant(tenantId) {
    return this.researchGroupHttp.getResearchGroupsByTenant(tenantId)
  }

  getJoinRequestsByGroup(groupId) {
    return this.researchGroupHttp.getJoinRequestsByGroup(groupId);
  }

  getJoinRequestsByUser(username) {
    return this.researchGroupHttp.getJoinRequestsByUser(username);
  }

  createJoinRequest(data) {
    return this.researchGroupHttp.createJoinRequest(data);
  }

  updateJoinRequest(update) {
    return this.researchGroupHttp.updateJoinRequest(update);
  }
}

export {
  ResearchGroupService
};
