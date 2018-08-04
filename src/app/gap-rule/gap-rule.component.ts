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
         let reservation = [moment(item['startDate']), moment(item['endDate'])];
         if (item.campsiteId in this.campsiteReservations){
           this.campsiteReservations[item['campsiteId']].push(reservation)
         }else {
           this.campsiteReservations[item['campsiteId']] = [reservation]
         }
    });
  }

  checkAvailability(){
    let campsites = this.JSONCampInfo['campsites'];
    let searchStartDate = moment(this.JSONCampInfo['search']['startDate']);
    let searchEndDate = moment(this.JSONCampInfo['search']['endDate']);
    this.availableCampsites = [];
    campsites.forEach((item) =>{
      if(item.id in this.campsiteReservations){
        // check if search conflicts with any existing reservation
        let no_conflicts = true;
        this.campsiteReservations[item.id].every((reservation) => {
            let reservationEndDate = reservation[1];
            let reservationStartDate = reservation[0];

            //First, check if the search date leaves a gap from existing reservation end date
            if (searchStartDate.isSame(moment(reservationEndDate).add(1, 'days'))) {
              no_conflicts = false;
            }
            //Check if the search end date leaves a gap with an existing reservation start date
            else if (searchEndDate.isSame(moment(reservationStartDate).subtract(1, 'days'))) {
              no_conflicts = false;
            }
            //Check if search start date is within existing reservation
            else if (searchStartDate.isSameOrAfter(reservationStartDate) && searchStartDate.isBefore(reservationEndDate)) {
              no_conflicts = false;
            }
            //Check if end date is within existing reservation
            else if (searchEndDate.isAfter(reservationStartDate) && searchEndDate.isSameOrBefore(reservationEndDate)) {
              no_conflicts = false;
            }
        });
        if (no_conflicts){
          this.availableCampsites.push(item.name)
        }
      }else{
        //the campsite has no reservations so you can book
        this.availableCampsites.push(item.name)
      }
    });
  }

}
