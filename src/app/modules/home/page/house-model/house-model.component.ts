import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@app/core/service/auth.service';
import { HomeModelDisplayItem } from '@app/data/schema/home-model';
import { House } from '@app/data/schema/house';

@Component({
  selector: 'app-house-model',
  templateUrl: './house-model.component.html',
  styleUrls: ['./house-model.component.scss']
})
export class HouseModelComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() model: HomeModelDisplayItem;
  @Input() filter: {
    block_number: string;
    land_number: string;
    min_price: string;
    max_price: string;
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;

  houses: MatTableDataSource<House & { action: string }>;
  homeTableDisplayedColumns = [
    'house_number',
    'block_number',
    'land_number',
    'price',
    'status'
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLogged$.subscribe(isLogged => {
      if (isLogged) {
        this.homeTableDisplayedColumns.push('action');
      } else {
        this.homeTableDisplayedColumns = this.homeTableDisplayedColumns.filter(
          x => x !== 'action'
        );
      }
    });
    this.houses = new MatTableDataSource<House & { action: string }>([
      ...this.model.attributes.houses.map(home => ({
        id: home.id,
        ...home.attributes,
        action: 'Edit'
      }))
    ]);
  }
  ngOnChanges(changes: SimpleChanges) {
    const {
      filter: { currentValue: filter }
    } = changes;
    this.houses = new MatTableDataSource<House & { action: string }>([
      ...this.model.attributes.houses
        .filter(item => {
          if (
            !filter.block_number &&
            !filter.land_number &&
            !filter.min_price &&
            !filter.max_price
          ) {
            return true;
          }
          if (filter.block_number && filter.land_number) {
            return (
              item.attributes.block_number === filter.block_number &&
              item.attributes.land_number === filter.land_number
            );
          }
          if (filter.min_price && filter.max_price) {
            return (
              item.attributes.price < filter.max_price &&
              item.attributes.price > filter.min_price
            );
          }
          if (filter.block_number) {
            return item.attributes.block_number === filter.block_number;
          }
          if (filter.block_number) {
            return item.attributes.block_number === filter.block_number;
          }
          if (filter.min_price) {
            return item.attributes.price > filter.min_price;
          }
          if (filter.max_price) {
            return item.attributes.price < filter.max_price;
          }
        })
        .map(home => ({
          id: home.id,
          ...home.attributes,
          action: 'Edit'
        }))
    ]);
    this.houses.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.houses.paginator = this.paginator;
  }
}
