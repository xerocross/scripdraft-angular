import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOpenerComponent } from './document-opener.component';

describe('DocumentOpenerComponent', () => {
  let component: DocumentOpenerComponent;
  let fixture: ComponentFixture<DocumentOpenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentOpenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
