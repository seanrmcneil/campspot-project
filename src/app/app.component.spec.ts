import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatToolbarModule } from "@angular/material";
import {MatCardModule } from "@angular/material";
import {GapRuleComponent} from "./gap-rule/gap-rule.component";
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        GapRuleComponent
      ],
      imports: [
        MatToolbarModule,
        MatCardModule,
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'campspot-app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('campspot-app');
  }));
});
