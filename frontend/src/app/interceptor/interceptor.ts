import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";

@Injectable()
export class Interceptor implements HttpInterceptor{
    constructor(private cookieService: CookieService){
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token:string = this.cookieService.get('jwt');
        let selectedCompany: string = sessionStorage.getItem('selectedCompany') as string;
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
        return next.handle(req);
    }
    
}