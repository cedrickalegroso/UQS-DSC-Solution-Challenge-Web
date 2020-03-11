import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerAuthComponent } from './teller-auth.component';

describe('TellerAuthComponent', () => {
  let component: TellerAuthComponent;
  let fixture: ComponentFixture<TellerAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
