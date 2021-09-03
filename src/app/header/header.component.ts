import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  options: FormGroup;
  filteredCountries: Observable<any[]>;
  levelControl = new FormControl('');
  cityControl = new FormControl('');
  countryControl = new FormControl(this.data.input_value);
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
    public data: DataService,
    public _router: Router,
    fb: FormBuilder
  ) {
    this.options = fb.group({
      level: this.levelControl,
      city: this.cityControl,
      country: this.countryControl,
    });
  }

  ngOnInit() {
    this.data.get_countries();
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(this.data.input_value),
      map((value) => this.filter_countries(value))
    );
  }

  // AUTOCOMPLETE FUNCTION

  filter_countries(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.data.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  input_handler(evt: any) {
    let value = evt.target.value;
    if (value.length > 1) {
      this.data.get_cities(value);
    }
  }

  // SUBMIT

  submit_evt(evt: any) {
    evt.preventDefault();
    let levels = this.selected_level;
    let city = this.options.get('city')?.value;
    let country = this.options.get('country')?.value;
    let location = `&location=${city ? city + '%2C%20' : ''}${country}`;
    let value = country;
    let level = '';
    if (levels.length > 0) {
      level = 'level=' + levels.join('&level=').replace(/ /g, '%20');
    }
    if (city) {
      value = `${city}, ${country}`; //-> fake input
    }

    this.data.input_value = value;
    this.data.update_settings(level + location);
    this.data.show_src_bar = false;
    this._router.navigate(['/']);
  }
}
