import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { SampleTaskStatus } from '../sample-task-status.enum';

@Component({
  selector: 'app-edit-sampleTask',
  templateUrl: './edit-sampleTask.component.html',
  styleUrls: ['./edit-sampleTask.component.scss']
})
export class EditSampleTaskComponent implements OnInit {
  editSampleTaskForm: sampleTaskForm = new sampleTaskForm();

  @ViewChild("sampleTaskForm")
  sampleTaskForm!: NgForm;

  isSubmitted: boolean = false;
  sampleTaskId: any;
  taskStatusOptions = [
    { label: 'In Progress', value: SampleTaskStatus.InProgress },
    { label: 'Completed', value: SampleTaskStatus.Completed }
  ];
  constructor(private toastr: ToastrService, private route: ActivatedRoute, private router: Router,
    private httpProvider: HttpProviderService) { }

  ngOnInit(): void {
    this.sampleTaskId = this.route.snapshot.params['sampleTaskId'];
    this.getSampleTaskDetailById();
  }

  getSampleTaskDetailById() {
    const getSampleTaskDetailByIdObservable = this.httpProvider.getSampleTaskDetailById(this.sampleTaskId);
if(getSampleTaskDetailByIdObservable){
    getSampleTaskDetailByIdObservable.subscribe((data: any) => {
      if (data != null && data.body != null) {
        var resultData = data.body;
        if (resultData) {
          this.editSampleTaskForm.Id = resultData.id;
          this.editSampleTaskForm.Title = resultData.title;
          this.editSampleTaskForm.Description = resultData.description;
          this.editSampleTaskForm.Status = resultData.status;
        }
      }
    },
      (error: any) => { });
  }
}

  EditSampleTask(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      const editSampleObservable = this.httpProvider.editSampleTask(this.editSampleTaskForm);
      if(editSampleObservable){
      editSampleObservable.subscribe(async data => {
        if (data.status != null) {
          if(data.status === 204)
              this.toastr.success("Updated Successfully");
              setTimeout(() => {
                this.router.navigate(['/Home']);
              }, 500);
            }
          
        
      },
        async error => {
          this.toastr.error("Something went wrong!");
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 500);
        });
      }
    }
  }
}

export class sampleTaskForm {
  Id: string= "";
  Title: string = "";
  Description: string = "";
  Status: string = "";

}
