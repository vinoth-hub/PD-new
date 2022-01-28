import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { PaginationViewModel } from 'src/app/view-models/pagination.view-model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  pagination: PaginationViewModel = new PaginationViewModel;
  constructor(private userService: UserService, private toastr:ToastrService) { }

  async ngOnInit(): Promise<void> {
    await this.refreshUsers(1);
  }
  async refreshUsers(pageNumber: number): Promise<void> {
    var response = await lastValueFrom(this.userService.loadUsers(pageNumber));
    this.users = response.userList;
    this.pagination = new PaginationViewModel(Math.ceil(response.count/3));
    this.pagination.setActiveIndex(pageNumber - 1)
  }
  async paginateTo(targetPage:number): Promise<void>{
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
  async resetPassword(userId: number, email: string):Promise<void>{
    try{
      await lastValueFrom(this.userService.resetPassword(userId, email));
      this.toastr.success('Password reset initiated');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
}
