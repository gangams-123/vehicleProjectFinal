import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Officials } from './officials';

describe('Officials', () => {
  let component: Officials;
  let fixture: ComponentFixture<Officials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Officials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Officials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
