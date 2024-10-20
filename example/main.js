const tableA = new CSVTable("users", "id,name,email,job;1,Juan,jn@gmail.com,2;2,Juan,juan@gmail.com,1", ",", ";");
const tableB = new CSVTable("jobs", "id,name;1,Teacher;2,Programmer", ",", ";");

tableA.relate(tableB, "job")

console.log(tableA.relationAll("job", tableA.matchAll({ "name": "Juan" })))
