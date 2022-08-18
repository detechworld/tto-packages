import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';

class ResearchNdaHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  createResearchNda({ tx, offchainMeta }) {
    return this.http.post(`/api/nda`, { tx, offchainMeta });
  }

  getResearchNda(ndaExternalId) {
    return this.http.get(`/api/nda/${ndaExternalId}`);
  }

  getResearchNdaListByCreator(creator) {
    return this.http.get(`/api/nda/creator/${creator}`);
  }

  getResearchNdaListByResearch(researchExternalId) {
    return this.http.get(`/api/nda/research/${researchExternalId}`);
  }

}

export {
  ResearchNdaHttp
};
