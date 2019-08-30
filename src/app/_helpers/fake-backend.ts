// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Observable, of, throwError } from 'rxjs';
// import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
//
// @Injectable()
// export class FakeBackendInterceptor implements HttpInterceptor {
//
//     constructor() { }
//
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // array in local storage for registered accountList
//         let accountList: any[] = JSON.parse(localStorage.getItem('accountList')) || [];
//
//         // wrap in delayed observable to simulate server api call
//         return of(null).pipe(mergeMap(() => {
//
//             // authenticate
//             if (request.url.endsWith('/accountList/authenticate') && request.method === 'POST') {
//                 // find if any user matches login credentials
//                 let filteredUsers = accountList.filter(user => {
//                     return user.username === request.body.username && user.password === request.body.password;
//                 });
//
//                 if (filteredUsers.length) {
//                     // if login details are valid return 200 OK with user details and fake jwt token
//                     let user = filteredUsers[0];
//                     let body = {
//                         id: user.id,
//                         username: user.username,
//                         firstName: user.firstName,
//                         lastName: user.lastName,
//                         token: 'fake-jwt-token'
//                     };
//
//                     return of(new HttpResponse({ status: 200, body: body }));
//                 } else {
//                     // else return 400 bad request
//                     return throwError({ error: { message: 'Username or password is incorrect' } });
//                 }
//             }
//
//             // get accountList
//             if (request.url.endsWith('/accountList') && request.method === 'GET') {
//                 // check for fake auth token in header and return accountList if valid, this security is implemented server side in a real application
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     return of(new HttpResponse({ status: 200, body: accountList }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return throwError({ error: { message: 'Unauthorised' } });
//                 }
//             }
//
//             // get user by id
//             if (request.url.match(/\/accountList\/\d+$/) && request.method === 'GET') {
//                 // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // find user by id in accountList array
//                     let urlParts = request.url.split('/');
//                     let id = parseInt(urlParts[urlParts.length - 1]);
//                     let matchedUsers = accountList.filter(user => { return user.id === id; });
//                     let user = matchedUsers.length ? matchedUsers[0] : null;
//
//                     return of(new HttpResponse({ status: 200, body: user }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return throwError({ error: { message: 'Unauthorised' } });
//                 }
//             }
//
//             // register user
//             if (request.url.endsWith('/accountList/register') && request.method === 'POST') {
//                 // get new user object from post body
//                 let newUser = request.body;
//
//                 // validation
//                 let duplicateUser = accountList.filter(user => { return user.username === newUser.username; }).length;
//                 if (duplicateUser) {
//                     return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
//                 }
//
//                 // save new user
//                 newUser.id = accountList.length + 1;
//                 accountList.push(newUser);
//                 localStorage.setItem('accountList', JSON.stringify(accountList));
//
//                 // respond 200 OK
//                 return of(new HttpResponse({ status: 200 }));
//             }
//
//             // delete user
//             if (request.url.match(/\/accountList\/\d+$/) && request.method === 'DELETE') {
//                 // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
//                 if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
//                     // find user by id in accountList array
//                     let urlParts = request.url.split('/');
//                     let id = parseInt(urlParts[urlParts.length - 1]);
//                     for (let i = 0; i < accountList.length; i++) {
//                         let user = accountList[i];
//                         if (user.id === id) {
//                             // delete user
//                             accountList.splice(i, 1);
//                             localStorage.setItem('accountList', JSON.stringify(accountList));
//                             break;
//                         }
//                     }
//
//                     // respond 200 OK
//                     return of(new HttpResponse({ status: 200 }));
//                 } else {
//                     // return 401 not authorised if token is null or invalid
//                     return throwError({ error: { message: 'Unauthorised' } });
//                 }
//             }
//
//             // pass through any requests not handled above
//             return next.handle(request);
//
//         }))
//
//         // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
//         .pipe(materialize())
//         .pipe(delay(500))
//         .pipe(dematerialize());
//     }
// }
//
// export let fakeBackendProvider = {
//     // use fake backend in place of Http service for backend-less development
//     provide: HTTP_INTERCEPTORS,
//     useClass: FakeBackendInterceptor,
//     multi: true
// };
