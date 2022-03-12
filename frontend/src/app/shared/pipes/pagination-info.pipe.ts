import { Pipe, PipeTransform } from '@angular/core';
import { PaginationWithFilter } from '../../view-models/paginate-with-filter.view-model';

@Pipe({
  name: 'paginationInfo'
})
export class PaginationInfoPipe implements PipeTransform {

  transform(value: PaginationWithFilter<any>, ...args: unknown[]): unknown {
    var total = value.list.length;
    var start = value.activeIndex + 1;
    var end = total > value.resultsPerPage ? value.resultsPerPage : total;
    if(isNaN(start) || isNaN(end) || isNaN(total))
      return null;
    return `Viewing ${start} to ${end} of ${total} records`;
  }

}
