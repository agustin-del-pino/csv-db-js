# CSV DB JS
Use CSV files as relation DB in JS.

# CDN

Add this CDN to use this lib.
```
https://cdn.statically.io/gh/agustin-del-pino/csv-db-js@main/csv-db.js
```

# CSV Client 
Allows to obtain the CSV file from a server.

The constructor of this class takes: 
`url` (the base url from where the csv files are retrieved), `separator` (for example, `,`), `delimiter` (for example `\n`).

The separator represents the column separation and the delimiter represents the row delimitation.

```csv
id, name; 1, Monika
```

In the previous example, the separator is a `,` and the delimiter is a `;`.

## Properties

- `url`, the given url at constructor.
- `sep`, the given separator at constructor.
- `dlm`, the given delimiter at constructor.


## API

### `ping()`
Pings to the server. Expects to obtain a `200 OK` by retrieving the `.ping` file.

### `loadRelations()`
Retrieves the releations csv. 

### `connect({loadRelations = false})`
Performs ping. In case `loadRelations` option is `true`, retrieves the relations.

### `retrieve(tableName)`
Retrieves a csv file that match with the `tableName`.

### `relate(table, key)`
Relates a table to its related table by the `key` *(foreign key)*.


# CSV Table
The javascript representation of an CSV Table.

The constructor of this class takes:
The `name` of the table, the `csv` plain-text content, the `sep` (separator), the `dlm` (delimiter).

## Properties

- `name` is table's name.
- `count` is the number of record within the table
- `headers` is table's array headers.
- `first` is the first record of the table.
- `last` is the last record of the table.
- `all` is record's array

## API

### `index(n)`
Retrieves a record by its specific index. A negative index will count back from the last record.

### `slice(start, end)`
Retrieves a portion of record's array, where `start` is included but `end` isn't.

### `match(m)`
Retrieves the first record that matches with `m` (which is an object).

### `matchAll(m)`
Retrieves all records that match with `m` (which is an object).

### `matchBy(m)`
Retrieves all records that match by the predicator `m` (which is a function).

### `relate(key, table)`
Relates a CSV table to the current one by a key *(it's recommend to use the same name as the foreign key)*.

### `relation(key, rec)` 
Returns the record related to `rec` (which is a record) from the related table by the `key`.

### `relationAll(key, rec)`
Returns all records related to `recs` (which is an array of record) from the related table by the `key`.

# CSV Files at Server Side

The csv files are the tables of the *"db"*. So, their filenames are table's name. As mandatory requirement, those must have
the `id` column of any type.

**Server Side**
```
db/
  - my_table.csv
  - .ping
css/
  - styles.css
js/
  - main.js
index.html
```

The `.ping` file is used by the `CSVClient` for ping-ing.

The `my_table.csv` must have at least this schema.

````csv
id: any, ...
````
> See more in the examples.

# Relations

The relation between tables works similar as *relation-database*. There is one (or more) column that works as foreign key. Also, the file `__relation.csv` must exists at server side. This file resolves the relations between tables.

**Relation CSV Schema**
````
name: table's name
key: relation column
related: related table's name
````

For example:

*Let `tableA` and `tableB`. The first one is related to the latter one by the column `job`*

**Table A**
````csv
id,name,job
0,Alicia,0
1,Diana,1
2,Maria,4
````

**Table B**
````csv
id,name
0,Programmer
1,Engineer
2,Cosmonaut
3,Doctor
4,Lawyer
````

*Let `tableA -> tableB` in `__relation.csv`*

```csv
name,key,related
tableA,job,tableB
```

Using `CSVClient` it will be like this:

````js
const conn = new CSVClient("http://url.com/db", ",", "\n");

await conn.connect({loadRelations:true});

const tableA = await conn.retrieve("tableA");
await conn.relate(tableA, "job");

const diana = tableA.match({"name":"Diana"});
const dianaJob = tableA.relation("job", diana);

console.log(diana);
console.log(dianaJob);
````

*Output*

````json
{"id": 1, "name": "Diana", "job": 1}
{"id": 1, "name": "Engineer"}
````