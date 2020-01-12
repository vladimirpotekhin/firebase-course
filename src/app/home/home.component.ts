import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  courses$: Observable<Course[]>;

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private readonly coursesService: CoursesService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.courses$ = this.coursesService.loadAllCourses();

    this.beginnerCourses$ = this.courses$.pipe(
      map(courses =>
        courses.filter(course => course.categories.includes("BEGINNER"))
      )
    );

    this.advancedCourses$ = this.courses$.pipe(
      map(courses =>
        courses.filter(course => course.categories.includes("ADVANCED"))
      )
    );
  }
}
