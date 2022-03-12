import { Pipe, PipeTransform } from '@angular/core';
import { Company } from '../../view-models/company.view-model';

@Pipe({
  name: 'companyOption'
})
export class CompanyOptionPipe implements PipeTransform {

  transform(value: Company, defaultCompany: string | number = 0): string {
    let defaultCompanyNum: number;
    if(typeof defaultCompany === 'string')
      defaultCompanyNum = parseInt(defaultCompany as string);
    else
      defaultCompanyNum = defaultCompany;
    if(value.companyID !== defaultCompanyNum)
      return value.name;
    return '[DEFAULT] - ' + value.name;
  }

}
