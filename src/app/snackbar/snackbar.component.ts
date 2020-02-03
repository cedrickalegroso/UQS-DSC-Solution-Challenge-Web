import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(
    private _snackbar: MatSnackBar,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  openSnackBar(Message: string, config: string) {
    this._snackbar.openFromComponent(SnackbarComponent, {
      data: Message,
      duration:  1000,
    });
  }



}
