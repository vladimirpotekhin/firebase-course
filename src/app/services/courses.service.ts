import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, first } from "rxjs/operators";
import { Course } from "../model/course";
import { Observable, from } from "rxjs";
import { convertSnaps } from "./db-utils";
import { Lesson } from "../model/lesson";
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
  providedIn: "root"
})
export class CoursesService {
  constructor(private readonly db: AngularFirestore) {}

  saveCourse(courseId: string, changes: Partial<Course>): Observable<unknown> {
    return from(this.db.doc(`courses/${courseId}`).update(changes))
  }

  loadAllCourses(): Observable<Course[]> {
    return this.db
      .collection("courses", ref => ref.orderBy("seqNo"))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Course>(snaps)),
        first()
      );
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db
      .collection("courses", ref => ref.where("url", "==", courseUrl))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps);

          return courses.length === 1 ? courses[0] : undefined;
        }),
        first()
      );
  }

  findLessons(
    courseId: string,
    sortOrder: OrderByDirection = "asc",
    pageNumber = 0,
    pageSize = 3
  ): Observable<Lesson[]> {
    return this.db
      .collection(`courses/${courseId}/lessons`, ref =>
        ref
          .orderBy("seqNo", sortOrder)
          .limit(pageSize)
          .startAfter(pageSize * pageNumber)
      )
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Lesson>(snaps)),
        first()
      );
  }
}
