import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSearchComponent } from './power-search.component';

describe('PowerSearchComponent', () => {
  let component: PowerSearchComponent;
  let fixture: ComponentFixture<PowerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowerSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
