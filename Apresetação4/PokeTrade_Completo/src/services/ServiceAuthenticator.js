import { Gateway } from '../gateway/Gateway.js';

export const ServiceAuthenticator = {
  token: '',
  user: null,

  async login(user, password) {
    const response = await Gateway.authenticateUser({ email: user, password });
    this.token = response.token;
    this.user = response.user;
    return response.user;
  },

  async logout() {
    this.token = '';
    this.user = null;
    await Gateway.logoutUser();
  },

  validateSession(token = this.token) {
    return Boolean(token);
  },

  async getLoggedUser() {
    if (this.user) return this.user;
    this.user = await Gateway.getLoggedUser();
    return this.user;
  },

  async registerUser(data) {
    const response = await Gateway.registerUser(data);
    this.token = response.token;
    this.user = response.user;
    return response.user;
  },
};
