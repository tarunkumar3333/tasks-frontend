import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HomeComponent, NgModalConfirm } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { of, throwError } from 'rxjs';
import { SampleTaskStatus } from '../sample-task-status.enum';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let httpProviderServiceSpy: jasmine.SpyObj<HttpProviderService>;
  let modalService: NgbModal;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
    const httpProviderSpy = jasmine.createSpyObj('HttpProviderService', ['getAllSampleTask', 'deleteSampleTaskById']);
  
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModalModule,
        ToastrModule.forRoot()
      ],
      declarations: [HomeComponent, NgModalConfirm],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: HttpProviderService, useValue: httpProviderSpy }
      ]
    }).compileComponents();
  
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    httpProviderServiceSpy = TestBed.inject(HttpProviderService) as jasmine.SpyObj<HttpProviderService>;
    modalService = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllSampleTask on ngOnInit', fakeAsync(() => {
    const sampleTasksList = [{ id: 1, title: 'Task 1', status: SampleTaskStatus.Created }];
    httpProviderServiceSpy.getAllSampleTask.and.returnValue(of({ body: sampleTasksList }));

    component.ngOnInit();
    tick();

    expect(httpProviderServiceSpy.getAllSampleTask).toHaveBeenCalled();
    expect(component.sampleTasksList).toEqual(sampleTasksList);
  }));

  it('should handle error when getAllSampleTask fails', fakeAsync(() => {
    httpProviderServiceSpy.getAllSampleTask.and.returnValue(throwError({ status: 404 }));

    component.ngOnInit();
    tick();

    expect(httpProviderServiceSpy.getAllSampleTask).toHaveBeenCalled();
    expect(component.sampleTasksList).toEqual([]);
  }));

  it('should return status text for SampleTaskStatus', () => {
    expect(component.getStatusText(SampleTaskStatus.Created)).toBe('Created');
    expect(component.getStatusText(SampleTaskStatus.InProgress)).toBe('In Progress');
    expect(component.getStatusText(SampleTaskStatus.Completed)).toBe('Completed');
  });

  it('should open delete confirmation modal', () => {
    const modalOpenSpy = spyOn(modalService, 'open').and.callThrough();
    const sampleTask = { id: 1, title: 'Task 1', status: SampleTaskStatus.Created };

    component.deleteSampleTaskConfirmation(sampleTask);

    expect(modalOpenSpy).toHaveBeenCalledWith(NgModalConfirm, { ariaLabelledBy: 'modal-basic-title' });
  });
  
  it('should handle error when deleteSampleTask fails', fakeAsync(() => {
    const sampleTask = { id: 1, title: 'Task 1', status: SampleTaskStatus.Created };
    httpProviderServiceSpy.deleteSampleTaskById.and.returnValue(throwError({ status: 500 }));

    component.deleteSampleTask(sampleTask);
    tick();

    expect(httpProviderServiceSpy.deleteSampleTaskById).toHaveBeenCalledWith(sampleTask.id);
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
  }));
});
