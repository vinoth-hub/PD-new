import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { CriteriaFormViewModel } from '../view-models/criteria-form.view-model';
import { CategoryFormViewModel } from '../view-models/category-form.view-model';
import { CategoryViewModel } from '../view-models/category.view-model';
import { PaginationViewModel } from '../view-models/pagination.view-model';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories:CategoryViewModel[] = []
  pagination: PaginationViewModel = new PaginationViewModel;
  modalRef: BsModalRef;
  categoryForm: CategoryFormViewModel = new CategoryFormViewModel;
  criteriaForm: CriteriaFormViewModel = new CriteriaFormViewModel;
  searchQuery: string = '';
  constructor(private categoryService: CategoryService, private toastr:ToastrService, private modalService: BsModalService, private loginService: LoginService) { 
    this.modalRef = new BsModalRef;
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.refreshCategories(1),
      this.getCriteriaOptions(),
      this.loadSummary()
    ])
  }
  async loadSummary(): Promise<void> {
    this.categoryForm.sourceCategoryOptions = await lastValueFrom(this.categoryService.getSummary());
  }
  async refreshCategories(pageNumber: number):Promise<void>{
    let response = await lastValueFrom(this.categoryService.getList(pageNumber, this.searchQuery));
    this.categories = response.list;
    this.pagination = new PaginationViewModel(Math.ceil(response.count/25));
    this.pagination.setActiveIndex(pageNumber - 1)
  }
  async paginateTo(targetPage:number): Promise<void>{ // Pagination done on server side
    await this.refreshCategories(targetPage)
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
  async updateExpiration(categoryItem: CategoryViewModel):Promise<void>{
    try{
      await lastValueFrom(this.categoryService.updateExpiration(categoryItem.categoryID, categoryItem.expiration));
      this.toastr.success('Expiration updated');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async deleteById(categoryID: number):Promise<void>{
    try{
      await lastValueFrom(this.categoryService.delete(categoryID));
      this.toastr.success('Category deleted');
      await this.refreshCategories(1);
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  openModal(template: TemplateRef<any>, category:CategoryViewModel){
    this.modalRef = this.modalService.show(template);
    this.categoryForm.category = Object.assign({}, category);
  }
  beginAddCriteria(template: TemplateRef<any>, category:CategoryViewModel){
    this.modalRef = this.modalService.show(template);
    this.criteriaForm.category = category;
  }
  async getCriteriaOptions(): Promise<void> {
    this.criteriaForm.criteriaOptions = await lastValueFrom(this.categoryService.getCriteriaOptions());
  }
  removeCriteriaFromForm(criteriaStr:string):void{
    this.criteriaForm.category.criteriaList = this.criteriaForm.category.criteriaList.filter(x => x !== criteriaStr);
  }
  addCriteriaToForm():void{
    this.criteriaForm.category.criteriaList.push(this.criteriaForm.newCriteria);
  }
  async submitCriteria():Promise<void>{
    try{
      await lastValueFrom(this.categoryService.updateCriteria(this.criteriaForm.category.categoryID, this.criteriaForm.category.criteriaList));
      this.modalRef.hide()
      this.toastr.success('Criteria updated');
      await this.refreshCategories(1);
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  beginAdd(template: TemplateRef<any>){
    this.openModal(template, new CategoryViewModel);
  }
  async submitForm():Promise<void>{
    try{
      if(this.categoryForm.category.categoryID > 0)
        await lastValueFrom(this.categoryService.editCategory(this.categoryForm.category.categoryID, this.categoryForm.category.name, this.categoryForm.category.expiration))
      else
        await lastValueFrom(this.categoryService.addCategory(this.categoryForm.sourceCategoryID, this.categoryForm.category.name, this.categoryForm.category.expiration))
      await this.refreshCategories(1)
      this.modalRef.hide()
      this.toastr.success('Saved successfully');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
}
