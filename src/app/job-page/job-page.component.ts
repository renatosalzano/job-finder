import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.scss'],
})
export class JobPageComponent implements OnInit {
  job: any;
  company: any;

  constructor(private route: ActivatedRoute, public http: HttpClient) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetch_data(id);
    }
  }

  fetch_data(id: string) {
    /*  */
    const url = `https://www.themuse.com/api/public/jobs/${id}`;
    this.http.get(url).subscribe((res: any) => {
      this.job = res;
      console.log(res);
      this.fetch_company_data(res.company.id);
    });
  }

  fetch_data_off() {
    /* const url = `https://www.themuse.com/api/public/companies/${id}`; */
    const url = `../../assets/job.json`;
    this.http.get(url).subscribe((res: any) => {
      this.job = res;
      console.log(res);
    });
  }

  fetch_company_data(id: string) {
    const url = `https://www.themuse.com/api/public/companies/${id}`;
    this.http.get(url).subscribe((res: any) => {
      this.company = res;
      console.log(res);
    });
  }
}
