import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Merchant, NULL_MERCHANT} from '../models/Merchant';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  api = environment.dbApiUrl + 'merchant';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(operation);
      return of(result as T);
    }
  }

  getMerchants(): Observable<Merchant[]> {
    return this.httpClient.get<Merchant[]>(this.api)
        .pipe(
            catchError(this.handleError<Merchant[]>('getMerchants', []))
        );
  }

  getMerchant(id: number): Observable<Merchant> {
    return this.httpClient.get<Merchant>(this.api + '/' + id.toString())
        .pipe(
            catchError(this.handleError<Merchant>('getMerchant with id ' + id.toString, NULL_MERCHANT))
        );
  }

  addMerchant(merchant: Merchant): Observable<any> {
    const {merchantId, ...body} = merchant;
    return this.httpClient.post<any>(this.api + '/add', body)
        .pipe(
            catchError(this.handleError<any>('addMerchant with Merchant ' + merchant.toString(), {}))
        );
  }

  updateMerchant(merchant: Merchant): Observable<any> {
    const {merchantId, ...body} = merchant;
    return this.httpClient.put<any>(this.api + '/update/' + merchantId.toString(), {...body})
        .pipe(
            catchError(this.handleError<any>('updateMerchant with id ' + merchant.merchantId.toString(), {}))
        );
  }

  deleteMerchant(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.api + '/delete/' + id.toString())
        .pipe(
            catchError(this.handleError<any>('deleteMerchant with id ' + id.toString(), {}))
        );
  }
}
