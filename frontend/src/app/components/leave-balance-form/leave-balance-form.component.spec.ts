import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveBalanceFormComponent } from './leave-balance-form.component';

describe('LeaveBalanceFormComponent', () => {
  let component: LeaveBalanceFormComponent;
  let fixture: ComponentFixture<LeaveBalanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveBalanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveBalanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
