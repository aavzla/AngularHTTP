import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
//Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  postSubject: Subject<Post[]>;
  postsURL: string;

  constructor(private http: HttpClient) {
    this.postSubject = new Subject<Post[]>();
    this.postsURL = 'https://httpangular-a664a.firebaseio.com/posts.json';
  }

  createAndStorePost(
    postData: Post
    //title: string, content: string
  ) {
    //The scenario when we receive the fields separated.
    //const postData: Post = { title: title, content: content };
    this.http
      //V1: Using TypeScript definition to resolve the definition of the object from the DB into a Model.
      //.post(
      //V2: Using HTTPClient to handle the recognition and casting of the object from the DB into a Model.
      .post<{ name: string }>(
        this.postsURL,
        postData
      )
      // In order to send the POST, Angular demands that we need to subscribe.
      // It could be an empty subscription without the call back if we wanted.
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  getPosts() {
    //The object received from the DB, it is an array of key-value object.
    //Because, we do not know the property name of the key, we use the property placeholder.
    //The property placeholder [] define that we assign the property name key to this string key.
    //And by the use of TypeScript definition, we said that the value should be a type Post.
    //This will allow us to define the object received and use it. Our model.
    this.http
      //V1: Using TypeScript definition to resolve the definition of the object from the DB into a Model.
      //.get(this.postsURL)
      //V2: Using HTTPClient to handle the recognition and casting of the object from the DB into a Model.
      .get<{ [key: string]: Post }>(this.postsURL)
      .pipe(map(
        //V1: Using TypeScript definition to resolve the definition of the object from the DB into a Model.
        //(responseData: { [key: string]: Post }) => {
        //V2: Using HTTPClient to handle the recognition and casting of the object from the DB into a Model.
        responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            //hasOwnProperty checks if the array contains the key as a property.
            //This is to get only own properties of an object and not inherited ones.
            //Or, to avoid trying to access the property of a prototype.
            if (responseData.hasOwnProperty(key)) {
              //The spread operator will take all key-value pairs of the responseData[key] and separate them by coma.
              //The result will be like { content: value, title: value }.
              //Because the object inside the push have a coma and a key - value with id and the key as a value in the end.
              //The end result will be { content: value, title: value, id: key }. This is our Post Model.
              //We integrate the key into our Model.
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }))
      .subscribe(posts => {
        //console.log(posts);
        //Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
        //We send the post array to the subscriber(s).
        this.postSubject.next(posts);
      });
  }

  deletePosts() {
    this.http
      .delete(this.postsURL)
      .subscribe(
        //responseData => {
        () => {
          //The responseData is null. So there is no responseData sent.
          //We could have an function without any parameter.
          //console.log(responseData);
          this.postSubject.next([]);
        }
      );
  }
}
