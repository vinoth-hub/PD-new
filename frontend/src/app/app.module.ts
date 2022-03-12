import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Interceptor } from './shared/interceptor/interceptor';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { UserComponent } from './user/user/user.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyComponent } from './company/company.component';
import { CategoryComponent } from './category/category.component';
import { CompanyOptionPipe } from './shared/pipes/company-option.pipe';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { PaginationInfoPipe } from './shared/pipes/pagination-info.pipe';
import { PowerSearchComponent } from './power-search/power-search.component';
import { NotesModalComponent } from './shared/components/notes-modal/notes-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    CompanyComponent,
    CategoryComponent,
    CompanyOptionPipe,
    QuickSearchComponent,
    PaginationInfoPipe,
    PowerSearchComponent,
    NotesModalComponent
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
