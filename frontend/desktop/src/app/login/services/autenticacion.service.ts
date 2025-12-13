import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  private url = 'http://localhost:3000/api/auth';

  constructor() { }

  public login(username: string, password: string): boolean {
    if ( username.length == 0 ) throw new Error('El nombre de usuario es obligatorio');
    if ( password.length == 0 ) throw new Error('La contraseña es obligatoria');
    

    return false;
  }

  

  public logout(): void {

  }

  public isAuthenticated(): boolean {
    return false;
  }

}
