import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-gap-rule',
  templateUrl: './gap-rule.component.html',
  styleUrls: ['./gap-rule.component.css']
})
export class GapRuleComponent implements OnInit {
  campInfo: string;
  JSONCampInfo: JSON; //Ideally, I would create a model for this
  fileToUpload: File = null;
  availableCampsites: Array<string>;
  campsiteReservations: Object; //Ideally, I would create a model for this

  constructor() { }

  ngOnInit() {
  }

  /** Upload the JSON file
   * Ideally, this would have validations on it **/
  uploadForm(files: FileList){
    this.fileToUpload = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.campInfo = (fileReader.result)
    };
    fileReader.readAsText(this.fileToUpload);
  }

  onSearch() {
    this.JSONCampInfo = JSON.parse(this.campInfo)
    this.calcCampsiteCalendar();
    this.checkAvailability(1);
  }

  /** Calculate the availability of each campsite.
   * This was chosen so that the availability can be added each time there is a new reservation
   * rather than on every search **/
  calcCampsiteCalendar(){
    this.campsiteReservations = {};
    let reservations = this.JSONCampInfo['reservations'];
    reservations.forEach((item) => {
      let dates = [];
      let currentDate = moment(item.startDate);
      let endDate = moment(item.endDate);
      while( currentDate.isSameOrBefore(endDate)){
        dates.push(moment(currentDate));
        currentDate = moment(currentDate).add(1, 'days');
      }
      if (item.campsiteId in this.campsiteReservations){
        let lastDateOfCurrentReservations = this.campsiteReservations[item.campsiteId][this.campsiteReservations[item.campsiteId].length-1]
        if(dates[dates.length-1].isAfter(lastDateOfCurrentReservations)){
          this.campsiteReservations[item.campsiteId] = this.campsiteReservations[item.campsiteId].concat(dates);
        }else{
          this.campsiteReservations[item.campsiteId] = this.campsiteReservations[item.campsiteId].unshift(dates);
        }
      }
      else {
        this.campsiteReservations[item.campsiteId] = dates;
      }
    });
    console.log(this.campsiteReservations);
  }

  checkAvailability(gapRule){
    gapRule = gapRule + 1; //Users should be able to enter 1 as gap rule, but to compare dates, I need one more day
    let campsites = this.JSONCampInfo['campsites'];
    let searchStartDate = moment(this.JSONCampInfo['search']['startDate']);
    let searchEndDate = moment(this.JSONCampInfo['search']['endDate']);
    this.availableCampsites = [];
    campsites.forEach((item) =>{
      if(item.id in this.campsiteReservations){
        // check if search conflicts with any existing reservation
        let conflicts = false;
        //Check if the any part of the reservation is already booked for that campsite
        console.log(this.campsiteReservations[item.id].filter(e =>
          e.isSame(moment(searchStartDate).subtract(1, 'days'))));
        if (this.campsiteReservations[item.id].filter(e => e.isSame(searchStartDate) || e.isSame(searchEndDate)).length > 0) {
          conflicts = true;
          console.log("campsite "+String(item.id)+"has conflicts with this search");
        }
        if(this.campsiteReservations[item.id].filter(e =>
          e.isSame(moment(searchStartDate).subtract(1, 'days'))).length === 0){
          console.log("campsite "+String(item.id) +"day before is empty");
          for (let i = 2; i <= gapRule; i++){
            if(this.campsiteReservations[item.id].filter(e =>
              e.isSame(moment(searchStartDate).subtract(gapRule, 'days'))).length > 0){
              console.log("campsite "+String(item.id)+" has a gap");
              conflicts = true;
              break;
            }
          }
        }
        if(this.campsiteReservations[item.id].filter(e =>
          e.isSame(moment(searchEndDate).add(1, 'days'))).length === 0){
          console.log("campsite "+String(item.id) +"day after is empty");
          for (let i = 2; i <= gapRule; i++){
            console.log(i);
            if(this.campsiteReservations[item.id].filter(e =>
              e.isSame(moment(searchEndDate).add(gapRule, 'days'))).length > 0){
              console.log("campsite "+String(item.id)+" has a gap");
              conflicts = true;
              break;
            }
          }
        }
        if (!conflicts){
          this.availableCampsites.push(item.name)
        }
      }else{
        //the campsite has no reservations so you can book
        this.availableCampsites.push(item.name)
      }
    });
  }

}
