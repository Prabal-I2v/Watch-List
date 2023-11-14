import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentProgressPopupComponent } from './enrollment-progress-popup.component';

describe('EnrollmentProgressPopupComponent', () => {
  let component: EnrollmentProgressPopupComponent;
  let fixture: ComponentFixture<EnrollmentProgressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentProgressPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentProgressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
