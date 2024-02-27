import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { WebApiService } from '../service/web-api.service';
import { SampleTaskStatus } from '../sample-task-status.enum';

@Component({
  selector: 'app-view-sampleTask',
  templateUrl: './view-sampleTask.component.html',
  styleUrls: ['./view-sampleTask.component.scss']
})
export class ViewSampleTaskComponent implements OnInit {

  sampleTaskId: any;
  sampleTaskDetail : any= [];
   
  constructor(public webApiService: WebApiService, private route: ActivatedRoute, private httpProvider : HttpProviderService) { }
  
  ngOnInit(): void {
    this.sampleTaskId = this.route.snapshot.params['sampleTaskId'];      
    this.getSampleTaskDetailById();
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
  
  getSampleTaskDetailById() {   
    const sampleTaskDetailsObservable = this.httpProvider.getSampleTaskDetailById(this.sampleTaskId);
    if(sampleTaskDetailsObservable){
    sampleTaskDetailsObservable.subscribe((data : any) => {      
      if (data != null && data.body != null) {
        var resultData = data.body;
        if (resultData) {
          this.sampleTaskDetail = resultData;
        }
      }
    },
    (error :any)=> { }); 
  }
}

}
