### Student Management API

Clone this repo.

**API:** 

Register tutor and students: *`/register`*
```
POST - https://tutor-student-management.herokuapp.com/api/register
```

Retrieve common students of tutor/tutors: *`/commonstudents`*
```
GET - https://tutor-student-management.herokuapp.com/api/commonstudents
```

Suspend a student: *`/suspend`*
```
POST - https://tutor-student-management.herokuapp.com/api/suspend
```

Retrieve list of students that can receive notifications: *`/retrievenotifications`*
```
POST - https://tutor-student-management.herokuapp.com/api/retrievenotifications
```





**Local Setup**

Update environment variables:

create `.env` file using `.env.sample` as format and supply MySql and other details
 

Run create database and migration:

npm run-script db:create


Create tables:

`npm run-script db:migrate`

Run App on dev environment:

`npm run-script dev`
