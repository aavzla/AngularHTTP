import { Component, OnInit } from '@angular/core';
//Imported from the angular common http.
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(
    //Injected to handle HTTP communications.
    private http: HttpClient
  ) { }

  ngOnInit() {
    console.log(this.constructor.name + ' ngOnInit started.');
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    //Testing if the postData was received.
    //console.log(postData);

    this.http
      .post(
        'https://httpangular-a664a.firebaseio.com/posts.json',
        postData
      )
      // In order to send the POST, Angular demands that we need to subscribe.
      // It could be an empty subscription without the call back if we wanted.
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    console.log(this.constructor.name + ' onFetchPosts started.');
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  //This method allow us to get the all Posts
  private fetchPosts() {
    this.http
      .get('https://httpangular-a664a.firebaseio.com/posts.json')
      .subscribe(posts => {
        console.log(posts);
      });
  }
}
