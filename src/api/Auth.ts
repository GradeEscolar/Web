export default class Auth {

  static tokenExpirado(access_token: string): boolean {
    const payloadBase64 = access_token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (payload && payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const currentDate = new Date();
      return expirationDate < currentDate;
    }

    return false;
  }

  static autenticado(): boolean {
    const access_token = localStorage.getItem('access_token');
    return access_token != null && !this.tokenExpirado(access_token);
  }
}