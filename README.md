##  a. How to build and run your program
- need to have angular cli, npm, node
- To install:
  - brew install npm
  - brew install node
  - npm install -g @angular/cli
- clone the project
- cd into the directory
- run ng serve
- open http://localhost:4200/
- upload the JSON file to the form and see the resuls
- **important**: you must name the file you upload differently each time you hit "search" or it will not recalculate the reservations

## b. A high-level description of your approach to solving the problem
- dfads

## c. Any assumptions or special considerations that were made
- I assumed that if the gap rule was more than 1 day, that gaps less than or equal to the gap rul are a problem. i.e. if you have a gap rule of 2, you want to avoid gaps of size 1 or 2. 

