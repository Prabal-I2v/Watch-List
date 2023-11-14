import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectionDialogComponent } from './image-selection-dialog.component';

describe('ImageSelectionDialogComponent', () => {
  let component: ImageSelectionDialogComponent;
  let fixture: ComponentFixture<ImageSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
