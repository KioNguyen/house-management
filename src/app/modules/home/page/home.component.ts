import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '@app/core/service/auth.service';
import { HouseModelService } from '@app/core/service/house-model.service';
import { HouseService } from '@app/core/service/house.service';
import { BaseDataItem } from '@app/data/schema/api-response';
import { HomeModel, HomeModelDisplayItem } from '@app/data/schema/home-model';
import { House } from '@app/data/schema/house';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLogged$: Observable<boolean> = this.authService.isLogged$.pipe();
  displayedColumns: string[] = ['position', 'name', 'weight'];
  blockNumbers: { value: string; label: string }[] = [];
  landNumbers: { value: string; label: string }[] = [];
  prices: { value: string; label: string }[] = [];
  filterForm: UntypedFormGroup;
  houses: BaseDataItem<House>[] = [];
  houseModels: HomeModelDisplayItem[] = [];
  currUser: { username: string } | null;
  panelOpenState = false;
  constructor(
    private authService: AuthService,
    private houseService: HouseService,
    private formBuilder: UntypedFormBuilder,
    private houseModelService: HouseModelService
  ) {
    this.buildForm();
  }

  get f() {
    return this.filterForm.controls;
  }
  ngOnInit(): void {
    this.authService.getUser$.subscribe(user => {
      if (user?.username) {
        this.currUser = user;
        this.displayedColumns.push('symbol');
      } else {
        this.currUser = null;
        this.displayedColumns = this.displayedColumns.filter(
          x => x !== 'symbol'
        );
      }
    });
    this.houseService.getAll().subscribe(res => {
      if (!res.data) {
        return;
      }
      this.houses = res.data;
      this.blockNumbers = this.getFilterFromData(res.data, 'block_number');
      this.landNumbers = this.getFilterFromData(res.data, 'land_number');
      this.prices = this.getFilterFromData(res.data, 'price');
      this.houseModelService.getAll().subscribe(({ data: models }) => {
        this.houseModels = this.mergeHouseModuleAndHouse(models, res.data);
      });
    });
  }

  mergeHouseModuleAndHouse(
    models: BaseDataItem<HomeModel>[],
    houses: BaseDataItem<House>[]
  ) {
    return models.map(model => {
      const homeBelong2 = houses.filter(
        house => house.attributes.model === model.attributes.model
      );
      const newModel: HomeModelDisplayItem = {
        ...model,
        attributes: {
          ...model.attributes,
          houses: homeBelong2
        }
      };
      return newModel;
    });
  }

  getFilterFromData(data, key) {
    return [...new Set(data.map(item => item.attributes[key]))]
      .sort(function(a, b) {
        return a === b ? 0 : a < b ? -1 : 1;
      })
      .map((landNumber: string) => ({
        value: landNumber,
        label: landNumber
      }));
  }

  private buildForm(): void {
    this.filterForm = this.formBuilder.group({
      block_number: [''],
      land_number: [''],
      min_price: [''],
      max_price: ['']
    });
  }
}
