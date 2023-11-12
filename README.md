# learning-management-system

# Screenshots

<img src="screenshots/dashboard.png" height="600">
<img src="screenshots/courses.png" height="600">
<img src="screenshots/classes.png" height="600">
<img src="screenshots/resources.png" height="600">
<img src="screenshots/assignments.png" height="600">

<br />
<br />

# Development
## Client
```bash
cd ./client

npm i 

npm run dev
```

## Server
```bash
cd ./server

# create and run a postgres container
./db.sh

poetry shell

poetry install

uvicorn main:app --reload

```
