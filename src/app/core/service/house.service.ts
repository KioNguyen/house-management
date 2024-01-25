import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import {
  APIResponsePagination,
  BaseDataItem
} from '@app/data/schema/api-response';
import { CreateHouseDTO, House, PatchHouseDTO } from '@app/data/schema/house';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  constructor(private _http: HttpClient) {}

  getAll(): Observable<APIResponsePagination<House>> {
    console.log(environment);
    return this._http.get<APIResponsePagination<House>>('/houses');
  }

  getSingle(id: number): Observable<House> {
    return this._http.get<House>(`/houses/${id}`);
  }
  create(house: CreateHouseDTO): Observable<BaseDataItem<House>> {
    return this._http.post<BaseDataItem<House>>('/houses', house);
  }
  patch(house: PatchHouseDTO): Observable<BaseDataItem<House>> {
    return this._http.patch<BaseDataItem<House>>(
      `/houses/${house.data.id}`,
      house
    );
  }
}
