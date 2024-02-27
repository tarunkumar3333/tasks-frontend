import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api.service';

//var apiUrl = "https://localhost:44370/";

var apiUrl = "http://localhost:36451";

var httpLink = {
  getAllSampleTask: apiUrl + "/api/sampleTasks/GetSampleTasks",
  deleteSampleTaskById: apiUrl + "/api/sampleTasks/DeleteTaskById",
  getSampleTaskDetailById: apiUrl + "/api/sampleTasks/GetSampleTaskById",
  saveSampleTask: apiUrl + "/api/sampleTasks/AddSampleTask",
  editSampleTask: apiUrl + "/api/sampleTasks/UpdateTask"

}

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private webApiService: WebApiService) { }

  public getAllSampleTask(): Observable<any> {
    return this.webApiService.get(httpLink.getAllSampleTask);
  }

  public deleteSampleTaskById(model: any): Observable<any> {
    return this.webApiService.delete(httpLink.deleteSampleTaskById + '?sampleTaskId=' + model);
  }

  public getSampleTaskDetailById(model: any): Observable<any> {
    return this.webApiService.get(httpLink.getSampleTaskDetailById + '?sampleTaskId=' + model);
  }

  public saveSampleTask(model: any): Observable<any> {
    return this.webApiService.post(httpLink.saveSampleTask, model);
  }

  public editSampleTask(model: any): Observable<any> {
    return this.webApiService.put(httpLink.editSampleTask, model);
  }
  
}
