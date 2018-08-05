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
  fileToUpload: File;
  availableCampsites: Array<string>;
  campsiteReservations: Object; //Ideally, I would create a model for this

  constructor() { }

  ngOnInit() {
  }

  /** Upload the JSON file
   * Ideally, this would have validations on it **/
  uploadForm(files: FileList){
    //reset everything on a new upload
    this.fileToUpload = null;
    this.JSONCampInfo = null;
    this.campInfo = null;
    this.availableCampsites = [];
    this.campsiteReservations = {};

    this.fileToUpload = files.item(0);
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.campInfo = (fileReader.result)
    };
    fileReader.readAsText(this.fileToUpload);
  }

  onSearch() {
    this.JSONCampInfo = JSON.parse(this.campInfo);
    this.campsiteReservations = this.calcCampsiteCalendar( this.JSONCampInfo['reservations']);
    this.availableCampsites = this.checkAvailability(1, this.JSONCampInfo, this.campsiteReservations);
  }

  /** Calculate the availability of each campsite.
   * This was chosen so that the availability can be added each time there is a new reservation
   * rather than on every search **/
  calcCampsiteCalendar(reservations){
    let campsiteReservations = {};
    reservations.forEach((item) => {
      let dates = [];
      let currentDate = moment(item.startDate);
      let endDate = moment(item.endDate);
      while( currentDate.isSameOrBefore(endDate)){
        dates.push(moment(currentDate));
        currentDate = moment(currentDate).add(1, 'days');
      }
      if (item.campsiteId in campsiteReservations){
        let lastDateOfCurrentReservations = campsiteReservations[item.campsiteId][campsiteReservations[item.campsiteId].length-1]
        if(dates[dates.length-1].isAfter(lastDateOfCurrentReservations)){
          campsiteReservations[item.campsiteId] = campsiteReservations[item.campsiteId].concat(dates);
        }else{
          campsiteReservations[item.campsiteId] = campsiteReservations[item.campsiteId].unshift(dates);
        }
      }
      else {
        campsiteReservations[item.campsiteId] = dates;
      }
    });
    return campsiteReservations;
  }

  checkAvailability(gapRule, campInfo, campsiteReservations){
    gapRule = gapRule + 1; //Users should be able to enter 1 as gap rule, but to compare dates, I need one more day
    let availableCampsites = [];
    let campsites = campInfo['campsites'];
    let searchStartDate = moment(campInfo['search']['startDate']);
    let searchEndDate = moment(campInfo['search']['endDate']);
    //check availability of each campsite
    campsites.forEach((item) =>{
      if(item.id in campsiteReservations){
        // check if search conflicts with any existing reservation
        let conflicts = false;
        //Check if the any part of the reservation is already booked for that campsite
        if (campsiteReservations[item.id].filter(e => e.isSame(searchStartDate) || e.isSame(searchEndDate)).length > 0) {
          conflicts = true;
        }
        //Check if there is a gap between the search start date and an existing reservation
        if(campsiteReservations[item.id].filter(e =>
          e.isSame(moment(searchStartDate).subtract(1, 'days'))).length === 0){
          for (let i = 2; i <= gapRule; i++){
            if(campsiteReservations[item.id].filter(e =>
              e.isSame(moment(searchStartDate).subtract(gapRule, 'days'))).length > 0){
              conflicts = true;
              break;
            }
          }
        }
        //Check if there is a gap between the search end date and an existing reservation
        if(campsiteReservations[item.id].filter(e =>
          e.isSame(moment(searchEndDate).add(1, 'days'))).length === 0){
          for (let i = 2; i <= gapRule; i++){
            if(campsiteReservations[item.id].filter(e =>
              e.isSame(moment(searchEndDate).add(gapRule, 'days'))).length > 0){
              conflicts = true;
              break;
            }
          }
        }
        if (!conflicts){
          availableCampsites.push(item.name)
        }
      }else{
        //the campsite has no reservations so you can book
        availableCampsites.push(item.name)
      }
    });
    return availableCampsites;
  }

}
