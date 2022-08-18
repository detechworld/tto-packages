import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';

class DisciplinesHttp extends Singleton {
  http = HttpService.getInstance();

  getAllDisciplines() {
    return this.http.get(`/api/disciplines`);
  }

  getDisciplinesByResearch(researchExternalId) {
    return this.http.get(`/api/disciplines/research/${researchExternalId}`);
  }

}

export {
  DisciplinesHttp
};
