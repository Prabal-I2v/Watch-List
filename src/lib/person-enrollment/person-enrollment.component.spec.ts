import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonEnrollmentComponent } from './person-enrollment.component';

describe('PersonEnrollmentComponent', () => {
  let component: PersonEnrollmentComponent;
  let fixture: ComponentFixture<PersonEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonEnrollmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
