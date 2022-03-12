import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CompanyComponent } from './company/company.component';
import { LoginComponent } from './login/login.component';
import { PowerSearchComponent } from './power-search/power-search.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';
import { UserComponent } from './user/user/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'quick-search',
    component: QuickSearchComponent
  },
  {
    path: 'power-search',
    component: PowerSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
