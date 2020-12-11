import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http'
import {
  map,
  catchError,
  tap
} from 'rxjs/operators';
//Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  postSubject: Subject<Post[]>;
  errorSubject: Subject<string>;
  postsURL: string;

  constructor(private http: HttpClient) {
    this.postSubject = new Subject<Post[]>();
    this.errorSubject = new Subject<string>();
    this.postsURL = 'https://httpangular-3e0c9-default-rtdb.firebaseio.com/posts.json';
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
        postData,
        {
          //The body value will give you the default behavior of giving the body of the HttpResponse(the data).
          //The events value will give us the event type of the HttpResponse.
          //The response value will give you access to the Full HttpResponse.
          observe: 'response'
        }
      )
      // In order to send the POST, Angular demands that we need to subscribe.
      // It could be an empty subscription without the call back if we wanted.
      .subscribe(responseData => {
        console.log(this.constructor.name + " -  The responseData object received.", responseData);
        //In the case of having the option observe with the value response,
        //this log will give us access to the data inside the body of the HttpResponse.
        console.log(this.constructor.name + " -  Option observe with response. The body of the HttpResponse.", responseData.body);
      }, error => {
        //Get the error on the console to display the full error
        console.log(this.constructor.name + " - Error on createAndStorePost.", error);
        //Send the error message to the subscribers
        this.errorSubject.next(error.message);
      });
  }

  getPosts() {
    //Set up for more than one param.
    let setupParams = new HttpParams();
    setupParams = setupParams.append('print', 'pretty');
    setupParams = setupParams.append('do-nothing', 'exactly');

    //The object received from the DB, it is an array of key-value object.
    //Because, we do not know the property name of the key, we use the property placeholder.
    //The property placeholder [] define that we assign the property name key to this string key.
    //And by the use of TypeScript definition, we said that the value should be a type Post.
    //This will allow us to define the object received and use it. Our model.
    this.http
      //V1: Using TypeScript definition to resolve the definition of the object from the DB into a Model.
      //.get(
      //V2: Using HTTPClient to handle the recognition and casting of the object from the DB into a Model.
      .get<{ [key: string]: Post }>(
        this.postsURL,
        {
          headers: new HttpHeaders({
            'Custom-Header': 'Hello'
          }),
          //Set up for one param only.
          //params: new HttpParams().set('print', 'pretty')
          //Set up for more than one param.
          params: setupParams,
          //The responseType allows you to change the result format of the HttpResponse.
          //The default behavior is JSON, but you have 'text' to have it transformed to text and 'blob' in a case of a file.
          responseType: 'json'
        }
      )
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
        }),
        //Option 1: Error handling with a function to do any task or treatment and it will throw the error.
        //Adding the catchError as 2nd. operator function to applied on the Pipe
        //Please visit, to understand more about using catchError. https://angular.io/guide/http#handling-request-errors.
        //catchError(errorResponse => {
        //You can do any task or treatment needed to you error before passing to the subscription.
        //console.log(this.constructor.name + " - Catching the error response with catchError with the pipe on getPosts.", errorResponse);

        //throwError is an Observable that emits an error observable only without emit to the Observer.
        //This will send an error to the subscribe method and it will be manage by the error on the subscribe.
        //return throwError(errorResponse);
        //})

        //Option 2: Error handling with a pre-defined function to do any task or treatment and it will throw the error.
        catchError(this.handleError)
      )
      .subscribe(posts => {
        //console.log(posts);
        //Implement the Subject (Observable) with subscription to communicate from the Service to the Component.
        //We send the post array to the subscriber(s).
        this.postSubject.next(posts);
      }, error => {
        //Get the error on the console to display the full error
        console.log(this.constructor.name + " - Error on getPosts.", error);
        //Send the error message to the subscribers
        this.errorSubject.next(error.message);
      });
  }

  deletePosts() {
    this.http
      .delete(
        this.postsURL,
        {
          //The body value will give you the default behavior of giving the body of the HttpResponse(the data).
          //The events value will give us the event type of the HttpResponse.
          //The response value will give you access to the Full HttpResponse.
          observe: 'events',
          //The responseType allows you to change the result format of the HttpResponse.
          //The default behavior is JSON, but you have 'text' to have it transformed to text and 'blob' in a case of a file.
          responseType: 'json'
        }
      )
      .pipe(
        //the tab operator simply allows us to execute some code without altering the response.
        tap(
          event => {
            //This line of code will give us two console logs.
            //The event type log and the log of the HttpResponse.
            console.log(this.constructor.name + " -  Option observe with events. The type and body of the HttpResponse.", event);
            //If the event is type Sent, we can log the Type
            //Or, Update something in the UI to basically inform the user that request was now sent and you're waiting for the response.
            if (event.type === HttpEventType.Sent) {
              console.log(this.constructor.name + " -  Option observe with events. The event type is Sent. The type of the HttpResponse.", event.type);
            }
            //If the event is type Response, we can log the body (the data)
            if (event.type === HttpEventType.Response) {
              console.log(this.constructor.name + " -  Option observe with events. The event type is Response. The body of the HttpResponse.", event.body);
            }
          }
        )
      )
      .subscribe(
        //responseData => {
        () => {
          //The responseData is null. So there is no responseData sent.
          //We could have an function without any parameter.
          //console.log(responseData);
          this.postSubject.next([]);
        }, error => {
          //Get the error on the console to display the full error
          console.log(this.constructor.name + " - Error on deletePosts.", error);
          //Send the error message to the subscribers
          this.errorSubject.next(error.message);
        }
      );
  }

  //This is a pre-defined function to treat the error.
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The backend message returned may define the problem.
      // The response body may contain clues as to what went wrong.
      // To test backend, change the read, write rules to block.
      // Or, go to Inspect on the browser, network and change it to offline.
      console.error(
        `Backend returned code: ${error.status}, ` +
        `Backend error message: ${error.message}.` +
        `Body was: ${error.error}`, error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      //'Something bad happened; please try again later.'
      error
    );
  }
}
