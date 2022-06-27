import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DiscussionBoardService} from '../services/discussion-board.service';
import {NestedPost, Post, EMPTY_POST} from '../models/post';

@Component({
  selector: 'app-discussion-board',
  templateUrl: './discussion-board.component.html',
  styleUrls: ['./discussion-board.component.css']
})
export class DiscussionBoardComponent implements OnInit, OnDestroy {
  displayPosts: Post[] = [];
  defaultImage = 'assets/img/img-default.png';
  posts: Post[] = [];
  showTable = true;
  showForm = false;
  formAlumniName: string;
  formPost: NestedPost;
  emptyPost = EMPTY_POST;
  searchText = '';
  statusMapping = ['Hidden', 'Shown'];
  approvalMapping = ['', 'Approved', 'Rejected', 'Pending'];

  private ngUnsub: Subject<any> = new Subject();

  constructor(private discussionBoardService: DiscussionBoardService) { }

  ngOnInit() {
    this.getPosts();
    this.showTable = true;
    this.showForm = false;
  }

  getPosts() {
    this.discussionBoardService.getPosts().pipe(takeUntil(this.ngUnsub))
        .subscribe(
            res => {
              this.posts = (res.map(post => ({
                ...post,
                status: post.status.toString(),
              })));
              this.setDisplay();
            });
  }

  loadNestedPost(post: Post) {
    const {alumniName, ...postBody} = post;
    this.formAlumniName = alumniName;
    if (post.approval !== 1) {
      // cannot view nested unapproved post, show without comments
      const nestedPost = {...postBody, comment: []};
      this.displayForm(nestedPost);
    } else {
      this.discussionBoardService.getNestedPost(post.postId).subscribe(res => {
        this.displayForm(res);
      });
    }
  }

  displayForm(post: NestedPost) {
    this.formPost = post;
    this.showTable = false;
    this.showForm = true;
  }

  hideForm() {
    this.showTable = true;
    this.showForm = false;
    this.formPost = {...this.emptyPost};
  }

  removePost(id: number) {
    this.discussionBoardService.deletePost(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getPosts());
  }

  updatePostStatus(id: number, action: string) {
    this.discussionBoardService.updatePostStatus(id, action).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getPosts());
  }

  removeComment(id: number) {
    this.discussionBoardService.deleteComment(id).pipe(takeUntil(this.ngUnsub)).subscribe(() =>
        this.getPosts());
  }

  parseFromDBDate(dateStr: string): Date {
    // from yyyy-mm-dd hh:mm:ss to date
    const [date, time] = dateStr.split(' ');
    const [year, month, day] = date.split('-').map(str => parseInt(str, 10));
    const [hour, min, sec] = time.split(':').map(str => parseInt(str, 10));
    return new Date(year, month - 1, day, hour, min, sec);
  }

  parseToDBDate(date: Date, time: NgbTimeStruct): string {
    // parse from ISO value into yyyy-mm-dd hh:mm:ss
    const {hour, minute} = time;
    date.setHours(hour);
    date.setMinutes(minute);
    // Fix timezone to GMT +8, en-GB locale format "dd/mm/yyyy, hh:mm:ss"
    const [dd, mm] = date.toLocaleString('en-GB', {timeZone: 'Singapore'}).split(/[/, ]/);
    let [, , yyyy] = date.toLocaleString('en-GB', {timeZone: 'Singapore'}).split(/[/, ]/);
    const [, , , , hhmmss] = date.toString().split(' ');
    // Manual error catching to prevent bad data passed into db crashing api server
    if (parseInt(yyyy, 10) < 1970) { yyyy = '1970' }
    return `${yyyy}-${mm}-${dd} ${hhmmss}`;
  }

  setDisplay() {
    this.displayPosts = this.posts.filter(
        s => s.text.toLowerCase().includes(this.searchText.toLowerCase())
            || s.userId.toString().toLowerCase().includes(this.searchText.toLowerCase())
            || this.statusMapping[s.status] === this.searchText,
    );
  }

  resetSearch() {
    this.searchText = '';
    this.setDisplay();
  }

  onClearSearch() {
    if (this.searchText === '') { this.setDisplay(); }
  }

  ngOnDestroy(): any {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}
