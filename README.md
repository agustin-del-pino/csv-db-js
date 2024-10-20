# CSV DB JS
Use CSV files as relation DB in JS.

# CDN

Add this CDN to use this lib.
```
```

# CSV Client 
Allows to obtain the CSV file from a server.

The constructor of this class takes: 
`url` (the base url from where the csv files are retrived), `separator` (for example, `,`), `delimiter` (for example `\n`).

The separator represents the column separation and the delimiter represents the row delimitation.

```csv
id, name; 1, Monika
```

In the previous example, the separator is a `,` and the delimiter is a `;`.

## Readonly

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

### `relate(table, ref)`
Relates a table to its related table by the `ref` *(reference)*.


# CSV Table
The javascript representation of an CSV Table.

The constructor of this class takes:
The `name` of the table, the `csv` plain-text content, the `sep` (separator), the `dlm` (delimeter).

## Readonly

- `name` is table's name.
- `count` is the number of record within the table
- `headers` is table's array headers.

## API

### `match(m)`
Retrives the first record that matches with `m` (which is an object).

### `matchAll(m)`
Retrives all records that match with `m` (which is an object).

### `matchBy(m)`
Retrives all records that match by the predicator `m` (which is a function).

### `relate(ref, table)`
Releates a CSV table to the current one by a reference.

### `relation(ref, rec)` 
Returns the record related to `rec` (which is a record) from the related table by the `ref`.

### `relationAll(ref, rec)`
Returns all records related to `recs` (which is an array of recrords) from the related table by the `ref`.