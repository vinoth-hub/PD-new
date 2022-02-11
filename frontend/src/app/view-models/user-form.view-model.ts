import { Company } from "./company.view-model";
import { UserViewModel } from "./user.view-model";

export class UserFormViewModel{
    user:UserViewModel = new UserViewModel;
    categoryOptions: string[] = [];
    accessPageOptions: string[] = [];
    userSummaryList:UserViewModel[] = [];
    copyUserId: number = 0;
    companyList: Company[] = [];
    targetCompanyId: string = '';
}