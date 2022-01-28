import { Component, OnInit } from '@angular/core';
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
  constructor(private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    await this.loadUsers(1);
  }
  async loadUsers(pageNumber: number): Promise<void> {
    var response = await lastValueFrom(this.userService.loadUsers(pageNumber));
    this.users = response.userList;
    this.pagination = new PaginationViewModel(response.count/3 + 1);
    this.pagination.setActiveIndex(pageNumber - 1)
  }
  async paginateTo(targetPage:number): Promise<void>{
    await this.loadUsers(targetPage)
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
}
