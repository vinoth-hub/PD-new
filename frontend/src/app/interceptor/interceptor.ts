import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, throwError, catchError } from "rxjs";
import { LoginService } from "../login/login.service";

@Injectable()
export class Interceptor implements HttpInterceptor{
    constructor(private cookieService: CookieService, private loginService: LoginService){
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token:string = this.cookieService.get('jwt');
        let selectedCompany: string = this.cookieService.get('selectedCompany');
        if(token && token.length){
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                },
                setParams:{
                    selectedCompany: selectedCompany
                }
            })
        }
        return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
            if(err.status === 401)
                this.loginService.challenge();
            return throwError(() => err);
        }))
    }
}