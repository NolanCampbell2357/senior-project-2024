import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementFormComponent } from './reimbursement-form.component';

describe('ReimbursementFormComponent', () => {
  let component: ReimbursementFormComponent;
  let fixture: ComponentFixture<ReimbursementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReimbursementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
