import { Company } from "./company.view-model";

export class PowerSearchFilterViewModel{
    public searchQuery:string = '1234';
    public companyOptions: Company[] = [];
    public categoryOptions: string[] = [];
    public selectedCompanies: Company[] = [];
    public selectedCategories: string[] = [];
    public documentDateFrom:Date = new Date;
    public documentDateTo:Date = new Date;
    public scannedDateFrom:Date = new Date;
    public scannedDateTo:Date = new Date;
}