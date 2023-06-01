import DataContext from "@/data_access/DataContext";

export default class Auth {

  static tokenExpirado(access_token: string): boolean {
    const payloadBase64 = access_token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (payload?.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      const currentDate = new Date();
      return expirationDate < currentDate;
    }

    return false;
  }

  static async autenticado(): Promise<boolean> {
    const access_token = localStorage.getItem('access_token');
    if (access_token == 'local_access') {
      if (!DataContext.acessoLocal)
        await DataContext.openLocalDb();
      return true;
    } else {
      return access_token != null && !this.tokenExpirado(access_token);
    }
  }
}