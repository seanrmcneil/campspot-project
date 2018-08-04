import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gap-rule',
  templateUrl: './gap-rule.component.html',
  styleUrls: ['./gap-rule.component.css']
})
export class GapRuleComponent implements OnInit {
  campInfo: string;
  JSONCampInfo: JSON;
  fileToUpload: File = null;

  constructor() { }

  ngOnInit() {
    console.log(this.campInfo);
  }

  onSearch() {
    this.JSONCampInfo = JSON.parse(this.campInfo)
    console.log(JSON.parse(this.campInfo));
    console.log(this.JSONCampInfo.reservations);

  }

  uploadForm(files: FileList){
    this.fileToUpload = files.item(0);

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.campInfo = (fileReader.result)
    };
    fileReader.readAsText(this.fileToUpload);
  }

}
