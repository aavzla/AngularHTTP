import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
//Imported from the angular common http.
//import { HttpClient } from '@angular/common/http';
//import { map } from 'rxjs/operators';
//Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
import { Subscription } from 'rxjs';

import { Post } from './post.model';

import { PostsService } from './posts.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('postForm', { static: true }) form: NgForm;
  loadedPosts: Post[];
  isFetching: boolean;
  errorMsg: string;
  private postsSubscription: Subscription;
  private errorSubscription: Subscription;

  constructor(
    //Injected to handle HTTP communications.
    //private http: HttpClient,
    private postsService: PostsService
  ) {
    this.loadedPosts = [];
    this.isFetching = false;
    this.errorMsg = '';
  }

  ngOnInit() {
    //console.log(this.constructor.name + ' ngOnInit started.');
    //this.fetchPosts();

    //Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
    //This subscription will get the post array from the service.
    this.postsSubscription = this.postsService.postSubject.subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }
    );

    this.errorSubscription = this.postsService.errorSubject.subscribe(
      errorMessage => {
        this.isFetching = false;
        this.errorMsg = errorMessage;
      }
    );

    this.getPosts();
  }

  onCreatePost(postData: Post) {
    //This allow to reset the error message displayed if there is any.
    this.resetErrorMessage();

    // Send Http request
    //Testing if the postData was received.
    //console.log(postData);

    this.postsService.createAndStorePost(postData);
    this.form.reset();
  }

  onFetchPosts() {
    //This allow to reset the error message displayed if there is any.
    this.resetErrorMessage();

    // Send Http request
    //console.log(this.constructor.name + ' onFetchPosts started.');
    //this.fetchPosts();

    this.getPosts();
  }

  onClearPosts() {
    //This allow to reset the error message displayed if there is any.
    this.resetErrorMessage();

    //Set the loader spinner.
    this.isFetching = true;

    // Send Http request
    this.postsService.deletePosts();
  }

  //This method allow us to get the all Posts.
  //This logic was transfered to a service and here with the subscription.
  /*
  private fetchPosts() {
    
    this.isFetching = true;

    //The object received from the DB, it is an array of key-value object.
    //Because, we do not know the property name of the key, we use the property placeholder.
    //The property placeholder [] define that we assign the property name key to this string key.
    //And by the use of TypeScript definition, we said that the value should be a type Post.
    //This will allow us to define the object received and use it. Our model.
    this.http
      //V1: Using TypeScript definition to resolve the definition of the object from the DB into a Model.
      //.get('https://httpangular-3e0c9-default-rtdb.firebaseio.com/posts.json')
      //V2: Using HTTPClient to handle the recognition and casting of the object from the DB into a Model.
      .get<{ [key: string]: Post }>('https://httpangular-3e0c9-default-rtdb.firebaseio.com/posts.json')
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
        this.isFetching = false;
        this.loadedPosts = posts;
      });
  }
  */
  private getPosts() {

    //Set the loader spinner.
    this.isFetching = true;
    //Get the post from the DB to the Service.
    this.postsService.getPosts();
  }

  private resetErrorMessage() {
    this.errorMsg = '';
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
