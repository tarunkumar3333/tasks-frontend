import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewSampleTaskComponent } from './view-sampleTask.component';
import { HttpProviderService } from '../service/http-provider.service';
import { WebApiService } from '../service/web-api.service';
import { of } from 'rxjs';
import { SampleTaskStatus } from '../sample-task-status.enum';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

describe('ViewSampleTaskComponent', () => {
  let component: ViewSampleTaskComponent;
  let fixture: ComponentFixture<ViewSampleTaskComponent>;
  let httpProviderServiceSpy: jasmine.SpyObj<HttpProviderService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const httpProviderSpy = jasmine.createSpyObj('HttpProviderService', ['getSampleTaskDetailById']);
    
    await TestBed.configureTestingModule({
      declarations: [ViewSampleTaskComponent],
      imports: [HttpClientModule], // Import HttpClientModule
      providers: [
        { provide: HttpProviderService, useValue: httpProviderSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { sampleTaskId: 1 } } } }
      ]
    }).compileComponents();

    httpProviderServiceSpy = TestBed.inject(HttpProviderService) as jasmine.SpyObj<HttpProviderService>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSampleTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve sample task details on ngOnInit', () => {
    const sampleTaskDetail = { id: 1, title: 'Sample Task', status: SampleTaskStatus.Created };
    
    // Mock the observable returned by getSampleTaskDetailById
    const observable = of({ body: sampleTaskDetail });
    httpProviderServiceSpy.getSampleTaskDetailById.and.returnValue(observable);

    component.ngOnInit();

    expect(component.sampleTaskId).toEqual(1);
    expect(httpProviderServiceSpy.getSampleTaskDetailById).toHaveBeenCalledWith(1);
    expect(component.sampleTaskDetail).toEqual(sampleTaskDetail);
  });

  it('should return status text for SampleTaskStatus', () => {
    expect(component.getStatusText(SampleTaskStatus.Created)).toBe('Created');
    expect(component.getStatusText(SampleTaskStatus.InProgress)).toBe('In Progress');
    expect(component.getStatusText(SampleTaskStatus.Completed)).toBe('Completed');
  });
});
