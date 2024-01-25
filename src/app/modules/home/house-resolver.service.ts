import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HouseService } from '@app/core/service/house.service';
import { House } from '@app/data/schema/house';

@Injectable({
  providedIn: 'root'
})
export class HouseResolver implements Resolve<House> {
  constructor(private router: Router, private houseService: HouseService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const { id } = route.params;
    if (id === 'create') {
      return null;
    }
    return this.houseService
      .getSingle(id)
      .pipe(catchError(() => this.router.navigateByUrl('/')));
  }
}
