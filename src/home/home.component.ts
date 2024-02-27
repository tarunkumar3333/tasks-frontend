import { Component, Input, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import  {SampleTaskStatus}  from '../sample-task-status.enum';

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  closeResult = '';
  sampleTasksList: any = [];
  constructor(private router: Router, private modalService: NgbModal,
    private toastr: ToastrService, private httpProvider : HttpProviderService) { }

  ngOnInit(): void {
    this.getAllSampleTask();
  }

  async getAllSampleTask() {
    const sampleTaskObservable = this.httpProvider.getAllSampleTask();
    if (sampleTaskObservable) {
      sampleTaskObservable.subscribe(
        (data: any) => {
          if (data != null && data.body != null) {
            var resultData = data.body;
            if (resultData) {
              this.sampleTasksList = resultData;
            }
          }
        },
        (error: any) => {
          if (error) {
            if (error.status == 404) {
              if (error.error && error.error.message) {
                this.sampleTasksList = [];
              }
            }
          }
        }
      );
    }
  }

  getStatusText(status: SampleTaskStatus): string {
    switch (status) {      
      case SampleTaskStatus.Created:
        return 'Created';
        case SampleTaskStatus.InProgress:
        return 'In Progress';
      case SampleTaskStatus.Completed:
        return 'Completed';
      
      default:
        return 'Unknown';
    }
  }

  AddSampleTask() {
    this.router.navigate(['AddSampleTask']);
  }

  deleteSampleTaskConfirmation(sampleTask: any) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result) => {
        this.deleteSampleTask(sampleTask);
      },
        (reason) => {});
  }

  deleteSampleTask(sampleTask: any) {
    this.httpProvider.deleteSampleTaskById(sampleTask.id).subscribe((data : any) => {
      if (data.status != null) {
        if(data.status === 204)
            this.toastr.success("Deleted Successfully");
            setTimeout(() => {
              this.getAllSampleTask();
            }, 500);
          }
    },
    (error : any) => {});
  }
}