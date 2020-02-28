import { Component, OnInit } from '@angular/core';
import { SuperadminService } from '../services/superadmin.service';
import { SystemService } from '../services/system.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private system: SystemService,
  ) { }

  ngOnInit() {
  }
p
}
