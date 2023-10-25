import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightAdderComponent } from './highlight-adder.component';

describe('HighlightAdderComponent', () => {
  let component: HighlightAdderComponent;
  let fixture: ComponentFixture<HighlightAdderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightAdderComponent]
    });
    fixture = TestBed.createComponent(HighlightAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
