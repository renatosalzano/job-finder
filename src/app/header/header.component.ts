import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  srcForm: FormGroup;
  filteredCountries: Observable<any[]>;
  filteredCities: Observable<any[]>;
  levelControl = new FormControl('');
  cityControl = new FormControl('');
  countryControl = new FormControl(this.app.input_value);
  loading = false;

  levels: string[] = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'management',
    'Internship',
  ];
  selected_level: string[] = [];

  constructor(
    public http: HttpClient,
    public app: AppService,
    public api: ApiService,
    public _router: Router,
    fb: FormBuilder
  ) {
    this.srcForm = fb.group({
      level: this.levelControl,
      city: this.cityControl,
      country: this.countryControl,
    });
  }

  ngOnInit() {
    this.api.get_countries();
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      debounceTime(200),
      startWith(this.app.input_value),
      map((value) => {
        return this.filter_countries(value);
      })
    );

    this.filteredCities = this.cityControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.cities_autocomplete(value);
      })
    );

    /* console.log(this.api.user_search_subject); */
  }

  // autocomplete functions

  cities_autocomplete(value: string): Observable<any> {
    return this.api.get_cities(value).pipe(
      map((res: any) => {
        if (value == '' || value.length < 3) return; // -> empty drop down
        return res.geonames;
      }),
      catchError((err) => throwError(err))
    );
  }

  filter_countries(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.api.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  // SUBMIT

  submit_evt(evt: any) {
    evt.preventDefault();
    let levels = this.selected_level;
    let city = this.srcForm.value?.city;
    let country = this.srcForm.value?.country;
    let location = `${city ? city + '%2C%20' : ''}${country}`;

    let value = country;
    let level = '';
    if (levels.length > 0) {
      level = 'level=' + levels.join('&level=').replace(/ /g, '%20');
    }
    if (city) {
      value = `${city}, ${country}`; //-> fake input
    }
    if (location) {
      location = '&location=' + location.replace(/ /g, '%20');
    }

    this.app.input_value = value;
    this.api.update_user_search({
      location: location,
      level: level,
      page_index: 1,
    });
    this.app.show_src_bar = false; // resize header
    this._router.navigate(['/']); // if search back to home
  }
}
