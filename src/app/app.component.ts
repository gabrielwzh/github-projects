import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  username = '';
  projects: any;
  count: number;
  getMarkdown: any;
  myHTML: string;
  p: any = 1;


  submit() {
    let array = [];
    let lastPage;
    const observablesList = [];
    console.log(this.username);

    this.http.get('https://api.github.com/users/' + this.username + '/repos?page=1&per_page=50', {observe: 'response'})
    .subscribe(resp => {
    if (resp.headers.get('Link') === null) {
      lastPage = 1;
    } else {
      lastPage = resp.headers.get('Link').split('page=')[3].split('&')[0];
    }

    console.log('last page: ' + lastPage);

    for (let i = 1; i < lastPage + 1; i++) {
        observablesList.push(this.http.get('https://api.github.com/users/' + this.username + '/repos?page=' + i + '&per_page=50'));
    }

    forkJoin(observablesList).subscribe(results => {
       // tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < results.length; i++) {
       array = array.concat(results[i]);
       }
       this.projects = array;
       this.count = array.length;
       console.log(this.projects);
      });
    });

    this.myHTML = '';
  }

  selectProject(proj) {
    console.log(proj);
    this.myHTML = '';
    this.getMarkdown = this.http.get('https://raw.githubusercontent.com/' + this.username + '/' + proj + '/master/README.md',
    {responseType: 'text'});
    this.getMarkdown.subscribe( data => { this.myHTML = data; });
  }


}
