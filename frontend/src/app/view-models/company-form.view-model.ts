import { Company } from "./company.view-model";

export class CompanyFormViewModel{
    company: Company = new Company;
    copyFromCompanyId:number = 0;
    companyList: Company[] = [];
}