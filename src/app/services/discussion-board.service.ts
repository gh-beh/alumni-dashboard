import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IntiEvent, NULL_EVENT} from '../models/event';
import {catchError, map} from 'rxjs/operators';
import {NestedPost, Post} from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class DiscussionBoardService {
  postApi = environment.dbApiUrl + 'post';
  commentApi = environment.dbApiUrl + 'comment';

  constructor(private httpClient: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(operation);
      return of(result as T);
    }
  }

  getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postApi)
        .pipe(
            catchError(this.handleError<Post[]>('getPosts', []))
        );
  }

  getNestedPost(id: number): Observable<NestedPost> {
    return this.httpClient.get<NestedPost[]>(this.postApi + '/nested/1')
        .pipe(
            map((arr: NestedPost[]) => arr.find(nestedPost => nestedPost.postId === id)),
        );
  }

  updatePostStatus(postId: number, action: string): Observable<any> {
    const newStatus = action === 'approve' ? 'approve' : 'reject';
    return this.httpClient.put<any>(this.postApi + '/' + newStatus + '/' + postId.toString(), null)
        .pipe(
            catchError(this.handleError<any>('updatePostStatus with id ' + postId.toString() + ' and action ' + action, {}))
        );
  }

  deletePost(id: number): Observable<any> {
    return this.httpClient.put<any>(this.postApi + '/delete/' + id.toString(), null)
        .pipe(
            catchError(this.handleError<any>('deletePost with id ' + id.toString(), {}))
        );
  }

  deleteComment(id: number): Observable<any> {
    return this.httpClient.put<any>(this.commentApi + '/delete/' + id.toString(), null)
        .pipe(
            catchError(this.handleError<any>('deleteComment with id ' + id.toString(), {}))
        );
  }
}
