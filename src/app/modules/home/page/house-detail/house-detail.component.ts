import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseModelService } from '@app/core/service/house-model.service';
import { HouseService } from '@app/core/service/house.service';
import { BaseDataItem } from '@app/data/schema/api-response';
import { House } from '@app/data/schema/house';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-house-detail',
  templateUrl: './house-detail.component.html'
})
export class HouseDetailComponent implements OnInit {
  house: BaseDataItem<House>;
  houseForm: UntypedFormGroup;
  currAction: 'create' | 'update' = 'create';
  actionTitle: 'Create' | 'Update' = 'Create';
  pageTitle: string;
  statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'booked', label: 'Booked' }
  ];
  modelOptions: { value: string; label: string }[] = [];
  typeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'villa', label: 'Villa' }
  ];
  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private houseService: HouseService,
    private houseModelService: HouseModelService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  get f() {
    return this.houseForm.controls;
  }
  ngOnInit(): void {
    this.route.data
      .pipe(
        map(res => {
          if (!res.house) {
            return;
          }
          const {
            house: { data }
          } = res;
          if (data.id) {
            this.currAction = 'update';
            this.actionTitle = 'Update';
            this.house = data;
          }
        })
      )
      .subscribe(() => {
        this.buildForm();
      });
    this.houseModelService.getAll().subscribe(res => {
      if (!res.data) {
        return;
      }
      this.modelOptions = res.data.map(model => ({
        value: model.attributes.model,
        label: model.attributes.model
      }));
      if (!this.houseForm.value.model) {
        this.houseForm.patchValue({ model: this.modelOptions[0]?.value || '' });
      }
    });
  }
  save() {
    if (!this.houseForm.valid) {
      this.houseForm.markAllAsTouched();
      return;
    }
    const pData = {
      data: {
        type: 'houses',
        attributes: {
          ...this.houseForm.value
        }
      }
    };
    if (this.currAction === 'update') {
      this.handlePatch(pData);
    } else {
      this.handleCreate(pData);
    }
  }

  handleCreate(data) {
    this.houseService.create(data).subscribe(res => {
      this.router.navigate(['/home']);
      this._snackBar.open('Successfully created new house!', 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration: 3000
      });
    });
  }

  handlePatch(data) {
    data.data.id = this.house.id;
    this.houseService.patch(data).subscribe(res => {
      this.router.navigate(['/home']);
      this._snackBar.open(
        `Successfully patched house ${this.house.attributes.house_number} !`,
        'Close',
        {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
        }
      );
    });
  }

  private buildForm(): void {
    this.houseForm = this.formBuilder.group({
      house_number: [this.house?.attributes.house_number, Validators.required],
      price: [this.house?.attributes.price, Validators.required],
      block_number: [this.house?.attributes.block_number, Validators.required],
      land_number: [this.house?.attributes.land_number, Validators.required],
      house_type: [
        this.house?.attributes.house_type || 'apartment',
        Validators.required
      ],
      model: [this.house?.attributes.model, Validators.required],
      status: [
        this.house?.attributes.status || 'available',
        Validators.required
      ]
    });
  }
}
