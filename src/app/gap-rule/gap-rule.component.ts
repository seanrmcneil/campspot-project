import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-gap-rule',
  templateUrl: './gap-rule.component.html',
  styleUrls: ['./gap-rule.component.css']
})
export class GapRuleComponent implements OnInit {
  campInfo: string;
  JSONCampInfo: JSON;
  fileToUpload: File = null;
  availableCampsites: any;
  campsiteReservations = {}; //make a typescrpipt object later

  constructor() { }

  ngOnInit() {
  }

  uploadForm(files: FileList){
    this.fileToUpload = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.campInfo = (fileReader.result)
    };
    fileReader.readAsText(this.fileToUpload);
  }

  onSearch() {
    this.JSONCampInfo = JSON.parse(this.campInfo)
    console.log(JSON.parse(this.campInfo));
    console.log(this.JSONCampInfo['reservations']);
    this.calcCampsiteCalendar();
    this.checkAvailability()
  }

  calcCampsiteCalendar(){
    let reservations = this.JSONCampInfo['reservations'];
    reservations.forEach((item) => {
         let reservation = [moment(item['startDate']), moment(item['endDate']+'Z')];
         console.log(reservation);
         if (item.campsiteId in this.campsiteReservations){
           this.campsiteReservations[item['campsiteId']].push(reservation)
         }else {
           this.campsiteReservations[item['campsiteId']] = [reservation]
         }
    });
  }

  checkAvailability(){
    let campsites = this.JSONCampInfo['campsites'];
    let searchStartDate = new Date(this.JSONCampInfo['search']['startDate']);
    let searchEndDate = new Date(this.JSONCampInfo['search']['endDate']);
    this.availableCampsites = [];
    campsites.forEach((item) =>{
      if(item.id in this.campsiteReservations){
        console.log(this.campsiteReservations[item.id]);
        this.campsiteReservations[item.id].forEach((reservation) => {
          console.log(reservation);
          // var tomorrow = new Date();
          // tomorrow.setDate(tomorrow.getDate() + 1);

          console.log(reservation[1].setDate(reservation[1] + 1));
          if(searchStartDate == reservation[1].getDate() +1){
            console.log("ONE DAY GAP");
          }
          // return (searchEndDate >= startdate && startD <= enddate);
        });
      }else{
        //the campsite has no reservations so you can book
        this.availableCampsites.push(item.name)
      }
    })
  }

}
