import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';

@Component({
  selector: 'app-add-sampleTask',
  templateUrl: './add-sampleTask.component.html',
  styleUrls: ['./add-sampleTask.component.scss']
})
export class AddSampleTaskComponent implements OnInit {
  addSampleTaskForm: sampleTaskForm = new sampleTaskForm();

  @ViewChild("sampleTaskForm")
  sampleTaskForm!: NgForm;

  isSubmitted: boolean = false;

  constructor(private router: Router, private httpProvider: HttpProviderService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  AddSampleTask(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      const saveSampleTaskObservable = this.httpProvider.saveSampleTask(this.addSampleTaskForm);
      if(saveSampleTaskObservable){
      saveSampleTaskObservable.subscribe(async data => {
        if (data.status != null) {
          if(data.status === 204)
              this.toastr.success("Created Successfully");
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
  Title: string = "";
  Description: string = "";
  Status: number = 0;
}