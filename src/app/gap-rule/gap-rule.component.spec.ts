import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GapRuleComponent } from './gap-rule.component';
import {MatCardModule} from "@angular/material";

import * as moment from 'moment';

describe('GapRuleComponent', () => {
  let component: GapRuleComponent;
  let fixture: ComponentFixture<GapRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GapRuleComponent ],
      imports: [
        MatCardModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to calculate a campsite calendar', () =>{
    const reservation = [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 4, "startDate": "2018-06-07", "endDate": "2018-06-10"}
      ];
    const calendar ={
      1: [ moment("2018-06-01"), moment("2018-06-01").add(1, 'days'), moment("2018-06-01").add(1, 'days').add(1, 'days')],
      4: [moment("2018-06-07"), moment("2018-06-07").add(1, 'days'),
        moment("2018-06-07").add(1, 'days').add(1, 'days'),
        moment("2018-06-07").add(1, 'days').add(1, 'days').add(1, 'days')]
    };
    expect(component.calcCampsiteCalendar(reservation)).toEqual(calendar);
  });

  it('should be able to calculate available campsites with gap rule of 1', () =>{
    const campInfo = {
      "search": {
        "startDate": "2018-06-04",
        "endDate": "2018-06-06"
      },
      "campsites": [
        {
          "id": 1,
          "name": "Cozy Cabin"
        },
        {
          "id": 2,
          "name": "Comfy Cabin"
        },
        {
          "id": 3,
          "name": "Rustic Cabin"
        },
        {
          "id": 4,
          "name": "Rickety Cabin"
        },
        {
          "id": 5,
          "name": "Cabin in the Woods"
        }
      ],
      "reservations": [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 1, "startDate": "2018-06-08", "endDate": "2018-06-10"},
        {"campsiteId": 2, "startDate": "2018-06-01", "endDate": "2018-06-01"},
        {"campsiteId": 2, "startDate": "2018-06-02", "endDate": "2018-06-03"},
        {"campsiteId": 2, "startDate": "2018-06-07", "endDate": "2018-06-09"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-02"},
        {"campsiteId": 3, "startDate": "2018-06-08", "endDate": "2018-06-09"},
        {"campsiteId": 4, "startDate": "2018-06-07", "endDate": "2018-06-10"}
      ]
    };

    const expectedAvailableCampsites = ["Comfy Cabin", "Rickety Cabin", "Cabin in the Woods"];
    const campCalendar = component.calcCampsiteCalendar(campInfo.reservations);
    expect(component.checkAvailability(1, campInfo, campCalendar)).toEqual(expectedAvailableCampsites);
  })

  it('should be able to calculate available campsites with gap rule of 2', () =>{
    const campInfo = {
      "search": {
        "startDate": "2018-06-04",
        "endDate": "2018-06-04"
      },
      "campsites": [
        {
          "id": 1,
          "name": "Cozy Cabin"
        },
        {
          "id": 2,
          "name": "Comfy Cabin"
        },
        {
          "id": 3,
          "name": "Rustic Cabin"
        },
        {
          "id": 4,
          "name": "Rickety Cabin"
        },
        {
          "id": 5,
          "name": "Cabin in the Woods"
        }
      ],
      "reservations": [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 1, "startDate": "2018-06-08", "endDate": "2018-06-10"},
        {"campsiteId": 2, "startDate": "2018-06-01", "endDate": "2018-06-01"},
        {"campsiteId": 2, "startDate": "2018-06-02", "endDate": "2018-06-03"},
        {"campsiteId": 2, "startDate": "2018-06-07", "endDate": "2018-06-09"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-02"},
        {"campsiteId": 3, "startDate": "2018-06-08", "endDate": "2018-06-09"},
        {"campsiteId": 4, "startDate": "2018-06-07", "endDate": "2018-06-10"}
      ]
    };

    const expectedAvailableCampsites = ["Cozy Cabin", "Cabin in the Woods"];
    const campCalendar = component.calcCampsiteCalendar(campInfo.reservations);
    expect(component.checkAvailability(2, campInfo, campCalendar)).toEqual(expectedAvailableCampsites);
  })

  it('should be able to calculate available campsites with none available', () =>{
    const campInfo = {
      "search": {
        "startDate": "2018-06-02",
        "endDate": "2018-06-04"
      },
      "campsites": [
        {
          "id": 1,
          "name": "Cozy Cabin"
        },
        {
          "id": 2,
          "name": "Comfy Cabin"
        },
        {
          "id": 3,
          "name": "Rustic Cabin"
        }
      ],
      "reservations": [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 2, "startDate": "2018-06-01", "endDate": "2018-06-03"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-02"}
      ]
    };

    const expectedAvailableCampsites = [];
    const campCalendar = component.calcCampsiteCalendar(campInfo.reservations);
    expect(component.checkAvailability(2, campInfo, campCalendar)).toEqual(expectedAvailableCampsites);
  })

  it('should be able to calculate available campsites when search is within other reservation dates', () =>{
    const campInfo = {
      "search": {
        "startDate": "2018-06-02",
        "endDate": "2018-06-04"
      },
      "campsites": [
        {
          "id": 1,
          "name": "Cozy Cabin"
        },
        {
          "id": 2,
          "name": "Comfy Cabin"
        },
        {
          "id": 3,
          "name": "Rustic Cabin"
        }
      ],
      "reservations": [
        {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-05"},
        {"campsiteId": 2, "startDate": "2018-06-05", "endDate": "2018-06-06"},
        {"campsiteId": 3, "startDate": "2018-06-01", "endDate": "2018-06-05"}
      ]
    };

    const expectedAvailableCampsites = ['Comfy Cabin'];
    const campCalendar = component.calcCampsiteCalendar(campInfo.reservations);
    expect(component.checkAvailability(2, campInfo, campCalendar)).toEqual(expectedAvailableCampsites);
  })
});
