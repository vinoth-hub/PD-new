import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, throwError, catchError, map } from "rxjs";
import { AppService } from "../app.service";
import { LoginService } from "../login/login.service";

@Injectable()
export class Interceptor implements HttpInterceptor{
    constructor(private cookieService: CookieService, private loginService: LoginService, private appService:AppService){
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.appService.httpEvent.next(true);
        let token:string = this.cookieService.get('jwt');
        let selectedCompany: string = this.cookieService.get('selectedCompany');
        let clone:HttpRequest<any> = Object.assign({},req);
        var cloneConfig:any = {};
        if(token && token.length)
            cloneConfig.setHeaders = {
                Authorization: `Bearer ${token}`
            }
        if(!req.headers.get('Content-Type')){
            cloneConfig.setHeaders = cloneConfig.setHeaders || {};
            cloneConfig.setHeaders["Content-Type"] = "application/json"
        }
        if(selectedCompany && !clone.params.get('selectedCompany')?.length)
            cloneConfig.setParams = { selectedCompany };
        clone = req.clone(cloneConfig);
        return next.handle(clone).pipe(map((ev) => {
            if(ev instanceof HttpResponse)
                this.appService.httpEvent.next(false);
            return ev;
        }), catchError((err: HttpErrorResponse) => {
            if(err){
                this.appService.httpEvent.next(false);
                if(err.status === 401)
                    this.loginService.challenge();
            }
            return throwError(() => err);
        }))
    }
}