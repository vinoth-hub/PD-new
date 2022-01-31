import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { PaginationViewModel } from 'src/app/view-models/pagination.view-model';
import { UserService } from '../user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserViewModel } from 'src/app/view-models/user.view-model';
import { UserFormViewModel } from 'src/app/view-models/user-form.view-model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/login/login.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: UserViewModel[] = [];
  pagination: PaginationViewModel = new PaginationViewModel;
  modalRef: BsModalRef;
  userForm: UserFormViewModel = new UserFormViewModel;
  constructor(private userService: UserService, private toastr:ToastrService, private modalService: BsModalService,private loginService: LoginService) { 
    this.modalRef = new BsModalRef;
  }

  async ngOnInit(): Promise<void> {
    try{
      await Promise.all([
        this.getAllCategories(),
        this.getAllAccessPages(),
        this.refreshUsers(1)
      ]);
      this.loginService.accessDenied.next(false)
    }
    catch(err){
      if(err instanceof HttpErrorResponse){
        if(err.status === 403)
          this.loginService.accessDenied.next(true);
        else
          this.toastr.error('Something went wrong');
      }
      else
        this.toastr.error('Something went wrong');
    }
  }
  
  async refreshUsers(pageNumber: number): Promise<void> {
    var response = await lastValueFrom(this.userService.loadUsers(pageNumber));
    this.users = response.userList;
    this.pagination = new PaginationViewModel(Math.ceil(response.count/3));
    this.pagination.setActiveIndex(pageNumber - 1)
  }
  async paginateTo(targetPage:number): Promise<void>{ // Pagination done on server side
    await this.refreshUsers(targetPage)
  }
  async paginatePrevious(): Promise<void>{
    let activeIndex: number = this.pagination.getActiveIndex();
    if(activeIndex === 0)
      return;
    await this.paginateTo(activeIndex)
  }
  async paginateNext(): Promise<void>{
    let activeIndex: number = this.pagination.getActiveIndex();
    if(activeIndex === this.pagination.getItemCount() - 1)
      return;
    await this.paginateTo(activeIndex + 2);
  }
  async deleteUser(userId: number):Promise<void>{
    try{
      await lastValueFrom(this.userService.deleteUser(userId));
      this.toastr.success('User deleted');
      await this.refreshUsers(1);
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async deactivateUser(userId: number):Promise<void>{
    try{
      await lastValueFrom(this.userService.deactivateUser(userId));
      this.toastr.success('User deactivated');
      await this.refreshUsers(1);
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async resetPassword(userId: number, email: string, username: string):Promise<void>{
    try{
      await lastValueFrom(this.userService.resetPassword(userId, email, username));
      this.toastr.success('Password reset initiated');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async getAllAccessPages(): Promise<void> {
    this.userForm.accessPageOptions = await lastValueFrom(this.userService.getAllAccessPages());
  }
  async getAllCategories(): Promise<void> {
    this.userForm.categoryOptions = await lastValueFrom(this.userService.getAllCategories());
  }
  openModal(template: TemplateRef<any>, userInModal:UserViewModel){
    this.modalRef = this.modalService.show(template);
    this.userForm.user = userInModal;
  }
  async submitForm():Promise<void>{
    try{
      if(this.userForm.user.userID){
        await lastValueFrom(this.userService.updateUser(this.userForm.user));
        this.toastr.success('User updated');
      }
      else{
        await lastValueFrom(this.userService.createUser(this.userForm.user));
        this.toastr.success('User created');
      }
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async beginCreateUser(template: TemplateRef<any>):Promise<void>{
    this.userForm.userSummaryList = await lastValueFrom(this.userService.getUserSummary())
    this.openModal(template, new UserViewModel);
  }
  async loadTransSecurity():Promise<void>{
    if(this.userForm.copyUserId)
      var tsDetails:any = await lastValueFrom(this.userService.loadTransSecurity(this.userForm.copyUserId))
    this.userForm.user.categoryList = tsDetails.categoryList.split(',');
    this.userForm.user.levelList = tsDetails.levelList.split(',');
  }
  async forceLogout(userId: number):Promise<void>{
    try{
      await lastValueFrom(this.userService.forceLogout(userId));
      this.toastr.success('User logged out');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
}
