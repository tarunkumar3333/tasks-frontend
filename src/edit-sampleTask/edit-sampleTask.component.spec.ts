import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EditSampleTaskComponent } from './edit-sampleTask.component';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { SampleTaskStatus } from '../sample-task-status.enum';

describe('EditSampleTaskComponent', () => {
  let component: EditSampleTaskComponent;
  let fixture: ComponentFixture<EditSampleTaskComponent>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let route: ActivatedRoute;
  let router: Router;
  let httpProviderServiceSpy: jasmine.SpyObj<HttpProviderService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const httpProviderSpy = jasmine.createSpyObj('HttpProviderService', ['getSampleTaskDetailById', 'editSampleTask']);
    
    await TestBed.configureTestingModule({
      declarations: [EditSampleTaskComponent],
      imports: [FormsModule],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { sampleTaskId: 1 } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: HttpProviderService, useValue: httpProviderSpy }
      ]
    }).compileComponents();

    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    httpProviderServiceSpy = TestBed.inject(HttpProviderService) as jasmine.SpyObj<HttpProviderService>;
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSampleTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve sample task details on ngOnInit', () => {
    const sampleTaskDetail = { id: '1', title: 'Sample Task', description: 'Description', status: SampleTaskStatus.InProgress };
    httpProviderServiceSpy.getSampleTaskDetailById.and.returnValue(of({ body: sampleTaskDetail }));

    component.ngOnInit();

    expect(component.sampleTaskId).toEqual(1);
    expect(httpProviderServiceSpy.getSampleTaskDetailById).toHaveBeenCalledWith(1);
    expect(component.editSampleTaskForm.Id).toEqual('1');
    expect(component.editSampleTaskForm.Title).toEqual('Sample Task');
    expect(component.editSampleTaskForm.Description).toEqual('Description');
  });

  it('should not edit sample task if form is invalid', () => {
    const isValid = false;

    component.EditSampleTask(isValid);

    expect(component.isSubmitted).toBeTrue();
    expect(httpProviderServiceSpy.editSampleTask).not.toHaveBeenCalled();
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
