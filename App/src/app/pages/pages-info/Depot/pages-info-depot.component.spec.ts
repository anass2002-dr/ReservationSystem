import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesInfoDepotComponent } from './pages-info-depot.component';

describe('PagesInfoDepotComponent', () => {
  let component: PagesInfoDepotComponent;
  let fixture: ComponentFixture<PagesInfoDepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesInfoDepotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesInfoDepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
