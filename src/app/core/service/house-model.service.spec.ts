import { TestBed } from '@angular/core/testing';
import { expect } from 'chai'; // Import the expect function from chai

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service);
  });
});
