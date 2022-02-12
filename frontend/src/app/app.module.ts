import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Interceptor } from './shared/interceptor';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { UserComponent } from './user/user/user.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyComponent } from './company/company.component';
import { CategoryComponent } from './category/category.component';
import { CompanyOptionPipe } from './shared/company-option.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    CompanyComponent,
    CategoryComponent,
    CompanyOptionPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info-custom',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
    BrowserAnimationsModule,
    NgSelectModule
  ],
  providers: [
    LoginService,
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    BsModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
