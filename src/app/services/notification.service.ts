import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Merchant, NULL_NOTIF} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  api = environment.dbApiUrl + 'notification';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(operation);
      if (result.hasOwnProperty('error')) { result['error'] = error; }
      return of(result as T);
    }
  }

  getNotifs(): Observable<Merchant[]> {
    return this.httpClient.get<Merchant[]>(this.api + '/all')
        .pipe(
            catchError(this.handleError<Merchant[]>('getNotifs', []))
        );
  }

  getNotif(id: number): Observable<Merchant> {
    return this.httpClient.get<Merchant>(this.api + '/' + id.toString())
        .pipe(
            catchError(this.handleError<Merchant>('getNotif with id ' + id.toString, NULL_NOTIF))
        );
  }

  addNotif(notif: Merchant): Observable<any> {
    const {notificationId, ...body} = notif;
    return this.httpClient.post<any>(this.api + '/add', body)
        .pipe(
            catchError(this.handleError<any>('addNotif with faq category' + notif.toString(), {}))
        );
  }

  updateNotif(notif: Merchant): Observable<any> {
    const {notificationId, ...body} = notif;
    return this.httpClient.put<any>(this.api + '/update/' + notificationId.toString(), body)
        .pipe(
            catchError(this.handleError<any>('updateNotif with id ' + notif.notificationId.toString(), {}))
        );
  }

  pushNotif(id: number): Observable<any> {
    return this.httpClient.put<any>(this.api + '/push/' + id.toString(), null)
        .pipe(
            catchError(this.handleError<any>('pushNotif with id ' + id.toString(), {}))
        );
  }

  deleteNotif(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.api + '/delete/' + id.toString())
        .pipe(
            catchError(this.handleError<any>('deleteNotif with id ' + id.toString(), { error: ''}))
        );
  }
}
