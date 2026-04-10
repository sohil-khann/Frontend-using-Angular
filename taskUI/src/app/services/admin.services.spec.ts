import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminServices } from './admin.services';

describe('AdminServices', () => {
  let service: AdminServices;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(AdminServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
