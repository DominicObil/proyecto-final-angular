import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantsAdminComponent } from './restaurants-admin.component';

describe('RestaurantsAdminComponent', () => {
  let component: RestaurantsAdminComponent;
  let fixture: ComponentFixture<RestaurantsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
