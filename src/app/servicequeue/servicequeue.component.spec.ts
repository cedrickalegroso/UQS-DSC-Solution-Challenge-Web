import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicequeueComponent } from './servicequeue.component';

describe('ServicequeueComponent', () => {
  let component: ServicequeueComponent;
  let fixture: ComponentFixture<ServicequeueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicequeueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicequeueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
