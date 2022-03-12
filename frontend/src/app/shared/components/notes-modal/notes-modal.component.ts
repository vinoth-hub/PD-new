import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { SearchResultViewModel } from 'src/app/view-models/search-result.view-model';
import { NotesModalService } from '../../services/notes-modal.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.scss']
})
export class NotesModalComponent implements OnChanges {

  @Input()
  public document:SearchResultViewModel = new SearchResultViewModel();
  @Input()
  public open:boolean = false;
  @ViewChild('notesModal')
  public template!: TemplateRef<any>;
  modalRef: BsModalRef = new BsModalRef;
  @Output()
  done: EventEmitter<void> = new EventEmitter();
  constructor(private searchService: NotesModalService, private modalService:BsModalService, private toasterService:ToastrService) { 
  }

  ngOnChanges():void{
    if(this.open)
      this.modalRef = this.modalService.show(this.template);
    else
      this.modalRef.hide();
  }
  async submit():Promise<void>{
    try{
      await lastValueFrom(this.searchService.updateNote(this.document.note, this.document.pictureID, this.document.notesID))
      this.toasterService.success('Saved successfully');
    }
    catch(err){
      this.toasterService.error('Something went wrong')
    }
    finally{
      this.done.emit();
    }
  }
}
