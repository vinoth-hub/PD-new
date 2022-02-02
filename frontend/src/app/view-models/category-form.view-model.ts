import { CategoryViewModel } from "./category.view-model";

export class CategoryFormViewModel{
    category: CategoryViewModel = new CategoryViewModel;
    expirationOptions: number[] = [5, 7, 9, 10, 15];
    sourceCategoryID: number = 0;
    sourceCategoryOptions: CategoryViewModel[] = [];
}