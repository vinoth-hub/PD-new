import { PaginationViewModel } from "./pagination.view-model"

export class PaginationWithFilter<T> extends PaginationViewModel{
    private _filteredList: T[] = []
    private _list:T[] = []
    private _resultsPerPage:number = 25;
    constructor(list: T[] = []){
        super(list.length);
        this.list = list;
    }
    private doPagination(){
        this._filteredList = this._list.slice(this._resultsPerPage * this.activeIndex , this._resultsPerPage * (this.activeIndex + 1))
        console.log(this._filteredList);
    }
    public get list(){
        return this._list;
    }
    public get filteredList(){
        return this._filteredList;
    }
    public set list(items: T[]){
        this._list = items;
        this.doPagination();
        super.itemCount = this._list.length;
    }
    public get resultsPerPage():number{
        return this._resultsPerPage;
    }
    public set resultsPerPage(resultsPerPage: number){
        this._resultsPerPage = resultsPerPage;
        this.doPagination();
        super.itemCount = this._list.length;
    }
    public override set activeIndex(index: number) {
        super.activeIndex = index;
        this.doPagination();
    }
    public override get activeIndex():number{
        return super.activeIndex;
    }
    public paginateNext():void{
        this.activeIndex++;
    }
    public paginatePrevious():void{
        this.activeIndex--;
    }
    public paginateTo(page: number):void{
        this.activeIndex = page - 1;
    }
    public override get pages(): number[] {
        return super.preparePages(Math.ceil(this.itemCount/this._resultsPerPage))
    }
}