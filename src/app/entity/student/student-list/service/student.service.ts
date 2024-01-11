import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../../../../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpclient : HttpClient) { }

  baseurl = "https://localhost:7267/api/Student";

  GetStudent() : Observable<Student[]>{
    return this.httpclient.get<Student[]>(this.baseurl);
  }

  CreateStudent(stu : Student) :Observable<Student>{
    return this.httpclient.post<Student>(this.baseurl,stu);
  }
}
