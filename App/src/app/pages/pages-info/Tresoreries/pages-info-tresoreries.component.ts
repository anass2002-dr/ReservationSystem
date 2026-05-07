import { Component, OnInit } from '@angular/core';
import { load } from './index';
@Component({
    selector: 'app-pages-info-tresoreries',
    templateUrl: './pages-info-tresoreries.component.html',
    styleUrls: ['./pages-info-tresoreries.component.css'],
    standalone: false
})
export class PagesInfoTresoreriesComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    load();
  }
}
