import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginResultComponent } from './login-result.component';

describe('LoginResultComponent', () => {
  let component: LoginResultComponent;
  let fixture: ComponentFixture<LoginResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
