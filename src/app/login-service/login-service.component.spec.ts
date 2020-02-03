import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginServiceComponent } from './login-service.component';

describe('LoginServiceComponent', () => {
  let component: LoginServiceComponent;
  let fixture: ComponentFixture<LoginServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
