from fastapi import FastAPI, Path
from typing import Optional
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = FastAPI()

students = {
    1: {
        "name": "Winfred",
        "age" : 21,
        "Year": "Year 4"
    }
}

class Student(BaseModel):
    name: str
    age: int
    Year: str

class UpdateStudent(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    Year: Optional[str] = None

@app.get("/")
def index():
    return {"name": "phil"}

@app.get("/get_student/{student_id}")
def get_student_id(student_id: int):
    return students[student_id]

@app.get("/get_student_name/{student_id}")
def get_student(*, student_id: int, name: Optional[str] = None):
    for student_id in students:
        if students[student_id]["name"] == name:
            return students[student_id]
    return {"Data": "Not found"}


@app.post("/create-student/{student_id}")
def create_student(student_id: int, student: Student):
    if student_id in students:
        return {"Error": "Student exists"}
    students[student_id] = student
    return students[student_id]
    
    
@app.put("/update-student/{student_id}")
def update_student(student_id: int, student: UpdateStudent):
    if student_id not in students:
        return {"Error": "No Student Available"}
    if student.name != None:
        students[student_id].name = student.name
    if student.age != None:
        students[student_id].age = student.age
    if student.Year != None:
        students[student_id].Year = student.Year
    
    return students[student_id]





uri = "mongodb+srv://winfred:BlackClover123$$@cluster3.i7plx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster3"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)