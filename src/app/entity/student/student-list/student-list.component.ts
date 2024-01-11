import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { error } from 'console';
import { Student } from '../../../models/Student';



@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink,RouterOutlet,HttpClientModule,CommonModule,ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit{

  httpClient = inject(HttpClient);
  baseurl = "https://localhost:7267/api/Student";
  students : any = [];
  studentFormGroup :FormGroup;

  successAlertVisible = false;
  errorAlertVisible = false;

  constructor(private fb: FormBuilder){
    this.studentFormGroup = this.fb.group({
      studentId:["",[Validators.required]],
      firstName:["",[Validators.required]],
      lastName:["",[Validators.required]],
      email:["",[Validators.required]],
      dateOfBirth:["",[Validators.required]],
      parentName:["",[Validators.required]],
      parentPhoneNumber:["",[Validators.minLength(10)]],
      address:["",[Validators.required]]
    })
  }

  fetchStudentData():void{
    this.httpClient.get(this.baseurl).subscribe((data:any)=>{
      this.students = data;
      console.log('students data',this.students);
    })
  }

  deleteStudent(id : BigInteger):void {
    if(confirm('Are you sure to delete?'))
    this.httpClient.delete(this.baseurl+'/'+id).subscribe(
      (data : any) => {
        this.fetchStudentData();
        console.log('deleteMsg',data);
        
      },
      (error) => {
        console.error('Error Delete Employee');
      }
    )
  }

  createStudent(stu : Student):void {
    this.httpClient.post(this.baseurl,stu).subscribe(
      (data: any) => {
       
        this.studentFormGroup.setValue({
          studentId:"",
          firstName:"",
          lastName:"",
          email:"",
          dateOfBirth:"",
          parentName:"",
          parentPhoneNumber:"",
          address:""
        });
       this.fetchStudentData();
       this.showSuccessAlert();
      },
      (error) => {
        console.error('Error creating employee:', error);
        this.showErrorAlert();
      }
    )
  }


   // Method to show success alert
   showSuccessAlert(): void {
    this.successAlertVisible = true;
    setTimeout(() => {
      this.successAlertVisible = false;
    }, 3000); // Hide the success alert after 3 seconds (adjust as needed)
  }

  // Method to show error alert
  showErrorAlert(): void {
    this.errorAlertVisible = true;
    setTimeout(() => {
      this.errorAlertVisible = false;
    }, 3000); // Hide the error alert after 3 seconds (adjust as needed)
  }

  fillform(item: Student) {
    console.log('Item selected:', item);
  
    // Access properties of the item object
    console.log('Student ID:', item.studentId);
    console.log('First Name:', item.firstName);
    // ... (access other properties)
  
    // Your existing code...
    this.studentFormGroup.setValue({
      studentId: item.studentId,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      dateOfBirth: item.dateOfBirth,
      parentName: item.parentName,
      parentPhoneNumber: item.parentPhoneNumber,
      address: item.address
    });
  }

  editEmployee(item: Student): void {
    this.httpClient.put(this.baseurl + '/'+item.studentId, item).subscribe(
      (data: any) => {
       
        // If you want to do something with the response, you can handle it here
        this.fetchStudentData();
        this.showSuccessAlert();
        this.studentFormGroup.setValue({
          studentId:"",
          firstName:"",
          lastName:"",
          email:"",
          dateOfBirth:"",
          parentName:"",
          parentPhoneNumber:"",
          address:""
        });
      },
      (error) => {
        this.showErrorAlert();
        console.error('Error edit student:', error);
        // Handle error if needed
      }
    );
  }
  onSubmitstudent(){

   //console.log('data',this.studentFormGroup.value);

    if(this.studentFormGroup.value.studentId != null && this.studentFormGroup.value.studentId != ''){
      this.editEmployee(this.studentFormGroup.value);
     }else{
      this.createStudent(this.studentFormGroup.value);
     }
   
  }

  ngOnInit(): void {
    this.fetchStudentData();
   }
}
