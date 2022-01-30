import { UserViewModel } from "./user.view-model";

export class UserFormViewModel{
    user:UserViewModel = new UserViewModel;
    categoryOptions: string[] = [];
    accessPageOptions: string[] = [];
    userSummaryList:UserViewModel[] = [];
    copyUserId: number = 0;
}