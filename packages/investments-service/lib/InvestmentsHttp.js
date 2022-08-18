import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  getResearchTokenSalesByResearch(researchExternalId) {
    return this.http.get(`/api/fundraising/research/${researchExternalId}`);
  }

  getResearchTokenSaleContributions(researchTokenSaleExternalId) {
    return this.http.get(`/api/fundraising/${researchTokenSaleExternalId}/contributions`);
  }

  getResearchTokenSaleContributionsByResearch(researchExternalId) {
    return this.http.get(`/api/fundraising/research/${researchExternalId}/contributions`);
  }

  createResearchTokenSale({ tx, isProposal, offchainMeta }) {
    return this.http.post('/api/fundraising', { tx, isProposal, offchainMeta });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/fundraising/contributions', { tx, isProposal });
  }

  getInvestmentPortfolio(username) {
    return this.http.get(`/api/investment-portfolio/${username}`);
  }

  updateInvestmentPortfolio(username, updated) {
    return this.http.put(`/api/investment-portfolio/${username}`, updated);
  }

  getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    return this.http.get(`/api/history/account/${account}/${symbol}/${step}/${cursor}/asset/${targetAsset}`);
  }

  getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/history/account/${account}/${cursor}`);
  }

  getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/history/symbol/${symbol}/${cursor}`);
  }

  getCurrentTokenSaleByResearch(researchId) {
    return this.http.get(`/api/contributions/researchId/${researchId}`);
  }
}

export {
  InvestmentsHttp
};
