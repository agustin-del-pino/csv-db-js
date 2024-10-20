const conn = new CSVClient("http://url.com/db", ",", "\n");

await conn.connect({loadRelations:true});

const tableA = conn.retrieve("tableA");
conn.relate(tableA, "job");

const diana = tableA.match({"name":"Diana"});
const dianaJob = tableA.relation("job", diana);

console.log(diana);
console.log(dianaJob);