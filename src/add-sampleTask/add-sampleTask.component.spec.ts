import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AddSampleTaskComponent, sampleTaskForm } from './add-sampleTask.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../service/http-provider.service';
import { of } from 'rxjs';

describe('AddSampleTaskComponent', () => {
  let component: AddSampleTaskComponent;
  let fixture: ComponentFixture<AddSampleTaskComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let httpProviderServiceSpy: jasmine.SpyObj<HttpProviderService>;
  let ngFormSpy: jasmine.SpyObj<NgForm>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpyObj = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const httpProviderSpyObj = jasmine.createSpyObj('HttpProviderService', ['saveSampleTask']);

    await TestBed.configureTestingModule({
      declarations: [AddSampleTaskComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastrService, useValue: toastrSpyObj },
        { provide: HttpProviderService, useValue: httpProviderSpyObj }
      ]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    httpProviderServiceSpy = TestBed.inject(HttpProviderService) as jasmine.SpyObj<HttpProviderService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSampleTaskComponent);
    component = fixture.componentInstance;
    ngFormSpy = jasmine.createSpyObj('NgForm', ['resetForm']);
    component.sampleTaskForm = ngFormSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add sample task if form is invalid', () => {
    const isValid = false;

    component.AddSampleTask(isValid);

    expect(component.isSubmitted).toBeTrue();
    expect(httpProviderServiceSpy.saveSampleTask).not.toHaveBeenCalled();
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(ngFormSpy.resetForm).not.toHaveBeenCalled();
  });
});
