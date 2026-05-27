import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfilePictureFormComponent } from './upload-profile-picture-form.component';

describe('UploadProfilePictureFormComponent', () => {
  let component: UploadProfilePictureFormComponent;
  let fixture: ComponentFixture<UploadProfilePictureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProfilePictureFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadProfilePictureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
