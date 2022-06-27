import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Admin, User} from '../models/user';
import md5 from 'md5';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  api = environment.dbApiUrl + 'account/admin';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(operation);
      if (result.hasOwnProperty('error')) { result['error'] = error; }
      return of(result as T);
    }
  }

  getAdmins(): Observable<Admin[]> {
    return this.httpClient.get<Admin[]>(this.api)
        .pipe(
            catchError(this.handleError<Admin[]>('getAdmins', []))
        );
  }

  addAdmin(user: Admin): Observable<any> {
    const {username, password, ...info} = user;
    const body = {username, password: md5(password)};
    console.log(password);
    console.log(md5(password));
    return this.httpClient.post<any>(this.api + '/add', body)
        .pipe(
            catchError(this.handleError<any>('addAdmin with username' + user.username, {}))
        );
  }

  resetPassword(user: Admin): Observable<any> {
    const {username, password, ...info} = user;
    const body = {password: md5(password)};
    return this.httpClient.put<any>(this.api + '/resetPassword/' + username.toString(), body)
        .pipe(
            catchError(this.handleError<any>('resetPassword with username ' + user.username, {}))
        );
  }
}
