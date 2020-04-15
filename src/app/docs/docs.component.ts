import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  isHiddenAbout = false;
  isiddenDevelopers = true;
  isiddenSourceCode= true;
  isHiddenApps = true;
  isHiddenManaging = true;
  isHiddenCreate = true;
   
  constructor() { }

  ngOnInit() {
  
  }


  showAbout(){
    this.isHiddenAbout = false;

    this.isiddenDevelopers = true;
    this.isiddenSourceCode = true;
    this.isHiddenApps = true;
    this.isHiddenManaging = true;
    this.isHiddenCreate = true;
  }

  showDev(){
    this.isiddenDevelopers = false;

    this.isHiddenAbout = true;
    this.isiddenSourceCode = true;
    this.isHiddenApps = true;
    this.isHiddenManaging = true;
    this.isHiddenCreate = true;
  }

  showSource(){
    this.isiddenSourceCode = false;

    this.isiddenDevelopers = true;
    this.isHiddenAbout = true;
    this.isHiddenApps = true;
    this.isHiddenManaging = true;
    this.isHiddenCreate = true;
  }

  showAppDownload(){
    this.isHiddenApps = false;

    this.isiddenDevelopers = true;
    this.isHiddenAbout = true;
    this.isiddenSourceCode = true;
    this.isHiddenManaging = true;
    this.isHiddenCreate = true;
  }

  showMananging(){
    this.isHiddenManaging = false;

    this.isHiddenApps = true;
    this.isiddenDevelopers = true;
    this.isHiddenAbout = true;
    this.isiddenSourceCode = true;
    this.isHiddenCreate = true;
  }

  showCreate(){
    this.isHiddenCreate = false;

    this.isHiddenManaging = true;
    this.isHiddenApps = true;
    this.isiddenDevelopers = true;
    this.isHiddenAbout = true;
    this.isiddenSourceCode = true;
  }



  

}
