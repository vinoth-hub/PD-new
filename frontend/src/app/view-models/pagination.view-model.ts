export class PaginationViewModel{
    private _isPreviousDisabled: boolean = false;
    private _isNextDisabled: boolean = false;
    private _itemCount: number = 0;
    private _activeIndex: number = -1;
    constructor(itemCount: number = 0){
        this._itemCount = itemCount;
        this._activeIndex = 0;
        this.init();
    }
    private init():void{
        this._isPreviousDisabled = this._activeIndex === 0;
        this._isNextDisabled = this._activeIndex === this._itemCount - 1;
        
    }
    public get itemCount():number{
        return this._itemCount;
    }
    public set itemCount(count: number){
        if(count <= this._activeIndex && count !== 0 && this._activeIndex !== 0)
            throw new RangeError('Active index is too high')
        this._itemCount = count;
        this.init();
    }
    public get activeIndex():number{
        return this._activeIndex;
    }
    public set activeIndex(index: number){
        if(index > this._itemCount - 1)
            throw new RangeError('Active index is too high')
        this._activeIndex = index;
        this.init();
    }
    public get pages():number[]{
        return this.preparePages(this._itemCount);
    }
    public get isPreviousDisabled():boolean{
        return this._isPreviousDisabled;
    }
    public get isNextDisabled():boolean{
        return this._isNextDisabled;
    }
    preparePages(count:number): number[]{
        var pages:number[] = [];
        for(var i=1; i <= count; i++)
            pages.push(i)
        return pages;
    }
}