import { Component, OnInit } from '@angular/core';
//Imported from the angular common http.
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

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
      .pipe(map(responseData => {
        const postsArray = [];
        for (const key in responseData) {
          //hasOwnProperty checks if the array contains the key as a property.
          //This is to get only own properties of an object and not inherited ones.
          //Or, to avoid trying to access the property of a prototype.
          if (responseData.hasOwnProperty(key)) {
            //The spread operator will take all key-value pairs of the responseData[key] and separate them by coma.
            //The result will be like { content: value, title: value }.
            //Because the object will have a coma and a key - value with id and the key as a value.
            //The end result will be { content: value, title: value, id: key }.
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }))
      .subscribe(posts => {
        console.log(posts);
      });
  }
}
