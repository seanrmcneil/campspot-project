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
  campsiteReservations: Object = {}; //Ideally, I would create a model for this

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
    this.checkAvailability(1)
  }

  /** Calculate the availability of each campsite.
   * This was chosen so that the availability can be added each time there is a new reservation
   * rather than on every search **/
  calcCampsiteCalendar(){
    let reservations = this.JSONCampInfo['reservations'];
    reservations.forEach((item) => {
         let reservation = [moment(item.startDate), moment(item.endDate)];
         if (item.campsiteId in this.campsiteReservations){
           this.campsiteReservations[item.campsiteId].push(reservation)
         }else {
           this.campsiteReservations[item.campsiteId] = [reservation]
         }
    });
  }

  checkAvailability(gapRule){
    gapRule = gapRule + 1; //Users should be able to enter 1 as gap rule, but to compare dates, I need one more day
    const minGap = 2; //The minimum gap is 2 so this would be used if different gap rules were needed
    let campsites = this.JSONCampInfo['campsites'];
    let searchStartDate = moment(this.JSONCampInfo['search']['startDate']);
    let searchEndDate = moment(this.JSONCampInfo['search']['endDate']);
    this.availableCampsites = [];
    campsites.forEach((item) =>{
      if(item.id in this.campsiteReservations){
        // check if search conflicts with any existing reservation
        let conflicts = false;
        this.campsiteReservations[item.id].forEach((reservation) => {
            let reservationEndDate = reservation[1];
            let reservationStartDate = reservation[0];

            //First, check if the search date leaves a gap from existing reservation end date
            if (searchStartDate.isBetween(moment(reservationEndDate).add(gapRule, 'days'),
              moment(reservationEndDate).add(minGap, 'days'))) {
              conflicts = true;
            }
            //Check if the search end date leaves a gap with an existing reservation start date
            else if (searchEndDate.isBetween(moment(reservationStartDate).subtract(gapRule, 'days'),
              moment(reservationEndDate).subtract(minGap, 'days'))) {
              conflicts = true;
            }
            //Check if search start date is within existing reservation
            else if (searchStartDate.isSameOrAfter(reservationStartDate) && searchStartDate.isSameOrBefore(reservationEndDate)) {
              conflicts = true;
            }
            //Check if end date is within existing reservation
            else if (searchEndDate.isSameOrAfter(reservationStartDate) && searchEndDate.isSameOrBefore(reservationEndDate)) {
              conflicts = true;
            }
        });
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
