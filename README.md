##  a. How to build and run your program
- need to have angular cli, npm, node
- To install:
  - brew install npm
  - brew install node
  - npm install -g @angular/cli
- clone the project
- cd into the directory
- run `ng serve` in the command line
- open http://localhost:4200/
- upload the JSON file to the form and see the resuls
- **important**: you must name the file you upload differently each time you hit "search" or it will not recalculate the reservations
- to run the unit tests:
  - run `ng test` in the command line

## b. A high-level description of your approach to solving the problem
- Steps to solve the problem
- A. Calculate a calendar of reserved dates per campsite
  - Go through all of the existing reservations and create an array of all the dates that are taken
  - i.e. reservation start date of 06/03 and end date of 06/06 for campsite 1 would return 1: Array(06/03, 06/04, 06/05, 06/06)
  - the final calendar would look something like this: 
  { 1: Array(06/03, 06/04, 06/05, 06/06, 06/10, 06/11),
    2: Array(06/01),
    3: Array(06/03, 06/05, 06/06)
    }
- B. Based on search dates, check the availability of the campsites
  - if the campsite is not in the campsite calendar object, add the campsite to the available campsites array
  - if the campsite is in the available campsite calendar
    - check if the start or end date are in the array of booked days and if they are, the campsite cannot be booked
    - if not, check if the the day before the searched for start date is free. If so, check the gap rule
      - if any of the days within the gap rule (plus one) prior to the searched for start date are booked, then this violates the gap rule. I check gap rule plus one because we need another reservation booked on the other side of the gap for their to be a gap.
    - apply the same logic for the search end date
    - return a list of campsites that can be booked
     

## c. Any assumptions or special considerations that were made
- I assumed that if the gap rule was more than 1 day, that gaps less than or equal to the gap rul are a problem. i.e. if you have a gap rule of 2, you want to avoid gaps of size 1 or 2. 

