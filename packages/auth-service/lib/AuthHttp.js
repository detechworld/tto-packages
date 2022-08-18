import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';

class AuthHttp extends Singleton {
  http = HttpService.getInstance();

  signIn(model) {
    return this.http.post('/auth/sign-in/', model);
  }

  adminSignIn(model) {
    return this.http.post('/tenant/sign-in/', model);
  }

  preliminaryRegistration(model) {
    return this.http.post('/preliminary-registration', model, { baseURL: `${registrationCommitteeUrl}/api` });
  }

  signUp(model) {
    return this.http.post('/auth/sign-up/', model);
  }
}

export {
  AuthHttp
};
