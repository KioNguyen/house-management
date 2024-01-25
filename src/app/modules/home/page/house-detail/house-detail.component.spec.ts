import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HouseDetailComponent } from './house-detail.component';

describe('ProjectDetailsComponent', () => {
  let component: HouseDetailComponent;
  let fixture: ComponentFixture<HouseDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HouseDetailComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    cy.mount(HouseDetailComponent);
  });
});
