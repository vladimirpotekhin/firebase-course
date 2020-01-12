import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"]
})
export class CourseDialogComponent implements OnInit {
  form: FormGroup;
  description: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly course: Course,
    private coursesService: CoursesService
  ) {
    const titles = course.titles;

    this.form = fb.group({
      description: [titles.description, Validators.required],
      longDescription: [titles.longDescription, Validators.required]
    });
  }

  ngOnInit() {}

  save() {
    const changes = this.form.value;

    this.coursesService
      .saveCourse(this.course.id, { titles: changes })
      .subscribe(() => {
        this.dialogRef.close(changes);
      });

    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
