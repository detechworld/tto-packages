import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';

class GrantsHttp extends Singleton {
  http = HttpService.getInstance();

  getAwardWithdrawalRequestPackageRef(awardNumber, paymentNumber) {
    return this.http.get(`/api/award-withdrawal-requests/${awardNumber}/${paymentNumber}`);
  }

  getApplicationPackageRef(agency, foaId, hash) {
    return this.http.get(`/applications/refs/${agency}/${foaId}/${hash}`);
  }

  getApplicationsRefsByResearch(researchId) {
    return this.http.get(`/applications/refs/research/${researchId}`);
  }

  getApplicationsRefsByFoa(foaId) {
    return this.http.get(`/applications/refs/foa/${foaId}`);
  }

  createGrantAwardWithdrawalRequest(researchExternalId, formData) {
    return this.http.post(`/api/award-withdrawal-requests/upload-attachments`, formData, {
      headers: {
        'Research-External-Id': researchExternalId,
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export {
  GrantsHttp
};
