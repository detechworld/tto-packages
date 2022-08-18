import { HttpService } from '@detechworld/http-service';
import { Singleton } from '@detechworld/toolbox';
import qs from 'qs';

class UsersHttp extends Singleton {
  http = HttpService.getInstance();

  getUsersProfiles(usernames) { // DEPRECATED
    return this.http.get(`/api/user/profiles${this.http.buildQueryString(usernames, 'accounts')}`);
  }

  getActiveUsersProfiles() { // DEPRECATED
    return this.http.get(`/api/user/active`);
  }

  // LIST

  getUsers(usernames) {
    const query = qs.stringify({ usernames });
    return this.http.get(`/api/users?${query}`);
  }

  getUsersByResearchGroup(teamId) {
    return this.http.get(`/api/users/group/${teamId}`);
  }

  getUsersByTenant(tenantId) {
    return this.http.get(`/api/users/tenant/${tenantId}`);
  }

  getUsersListing(query) {
    const q = qs.stringify(query);
    return this.http.get(`/api/users/listing?${q}`);
  }

  // ONE

  getUser(username) {
    return this.http.get(`/api/user/name/${username}`);
  }

  getUserByEmail(email) {
    return this.http.get(`/api/user/email/${email}`);
  }

  updateUserAccount(username, { tx }) {
    return this.http.put(`/api/user/account/${username}`, { tx });
  }

  updateUserProfile(username, payload) {
    return this.http.put(`/api/user/profile/${username}`, payload);
  }

}

export {
  UsersHttp
};
