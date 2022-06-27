import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NULL_REWARD, Reward} from '../models/reward';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  api = environment.dbApiUrl + 'voucher';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(operation);
      return of(result as T);
    }
  }

  getEvents(): Observable<Reward[]> {
    return this.httpClient.get<Reward[]>(this.api)
        .pipe(
            catchError(this.handleError<Reward[]>('getEvents', []))
        );
  }

  getEvent(id: number): Observable<Reward> {
    return this.httpClient.get<Reward>(this.api + '/' + id.toString())
        .pipe(
            catchError(this.handleError<Reward>('getEvent with id ' + id.toString, NULL_REWARD))
        );
  }

  addEvent(reward: Reward): Observable<any> {
    const {voucherId, ...body} = reward;
    return this.httpClient.post<any>(this.api + '/add', {...body, status: parseInt(status, 10)})
        .pipe(
            catchError(this.handleError<any>('addEvent with event ' + reward.toString(), {}))
        );
  }

  updateEvent(event: Reward): Observable<any> {
    const {voucherId, ...body} = event;
    return this.httpClient.put<any>(this.api + '/update/' + voucherId.toString(), {...body, status: parseInt(status, 10)})
        .pipe(
            catchError(this.handleError<any>('updateEvent with id ' + event.voucherId.toString(), {}))
        );
  }

  deleteEvent(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.api + '/delete/' + id.toString())
        .pipe(
            catchError(this.handleError<any>('deleteEvent with id ' + id.toString(), {}))
        );
  }
}
