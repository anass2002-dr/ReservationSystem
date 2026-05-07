import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesInfoTresoreriesComponent } from './pages-info-tresoreries.component';

describe('PagesInfoTresoreriesComponent', () => {
  let component: PagesInfoTresoreriesComponent;
  let fixture: ComponentFixture<PagesInfoTresoreriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesInfoTresoreriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesInfoTresoreriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
