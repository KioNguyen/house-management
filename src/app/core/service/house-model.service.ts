import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { APIResponsePagination } from '@app/data/schema/api-response';
import { HomeModel } from '@app/data/schema/home-model';
@Injectable({
  providedIn: 'root'
})
export class HouseModelService {
  constructor(private _http: HttpClient) {}

  getAll(): Observable<APIResponsePagination<HomeModel>> {
    return this._http.get<APIResponsePagination<HomeModel>>('/house_models');
  }
}
