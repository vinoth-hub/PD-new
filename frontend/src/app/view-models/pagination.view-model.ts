export class PaginationViewModel{
    private isPreviousDisabled: boolean = false;
    private isNextDisabled: boolean = false;
    private itemCount: number = 0;
    private activeIndex: number = 0;
    constructor(itemCount: number = 0){
        this.itemCount = itemCount;
        this.activeIndex = 0;
        this.init();
    }
    setItemCount(count: number):void{
        if(count <= this.activeIndex)
            throw new RangeError('Active index is too high')
        this.itemCount = count;
        this.init();
    }
    setActiveIndex(index: number):void{
        if(index > this.itemCount - 1)
            throw new RangeError('Active index is too high')
        this.activeIndex = index;
        this.init();
    }
    getPages():number[]{
        var pages:number[] = [];
        for(var i=1; i <= this.itemCount; i++)
            pages.push(i)
        return pages;
    }
    private init():void{
        this.isPreviousDisabled = this.activeIndex === 0;
        this.isNextDisabled = this.activeIndex === this.itemCount - 1;
        
    }
    getPreviousDisabled():boolean{
        return this.isPreviousDisabled;
    }
    getNextDisabled():boolean{
        return this.isNextDisabled;
    }
    getActiveIndex():number{
        return this.activeIndex;
    }
    getItemCount():number{
        return this.itemCount;
    }
}