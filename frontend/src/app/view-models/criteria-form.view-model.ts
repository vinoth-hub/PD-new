import { CategoryViewModel } from "./category.view-model";

export class CriteriaFormViewModel{
    category: CategoryViewModel = new CategoryViewModel
    criteriaOptions: string[] = []
    newCriteria: string = '';
}