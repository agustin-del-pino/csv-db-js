class CSVError extends Error { }
class CSVPingError extends CSVError { }
class CSVNoRelationError extends CSVError { }
class CSVUnexpectedError extends CSVError { }
class CSVNotFoundError extends CSVError { }

const RELATION_TABLE = "__relation"
const PING = ".ping"

class CSVTable {
    #name = "";
    #headers = [];
    #records = [];
    #relations = [];

    /**
     * 
     * @param {string} csv 
     * @param {string} sep 
     * @param {string} dlm 
     */
    constructor(name, csv, sep, dlm) {
        this.#name = name;
        csv += "\x00";
        let h = true;

        for (let i = 0, s = 0, c = 0; ;) {
            if (csv[i] === "\x00") {
                this.#records.at(-1)[this.#headers[c]] = csv.substring(s, i)
                break;
            }

            if (csv[i] === sep) {
                if (h) {
                    this.#headers.push(csv.substring(s, i))
                } else {
                    this.#records.at(-1)[this.#headers[c]] = csv.substring(s, i)
                }
                i++;
                c++;
                s = i;
                continue;
            }

            if (csv[i] === dlm) {
                if (h) {
                    h = false;
                    this.#headers.push(csv.substring(s, i))
                } else {
                    this.#records.at(-1)[this.#headers[c]] = csv.substring(s, i)
                }

                this.#records.push({})

                i++;
                c = 0;
                s = i;
                continue
            }

            i++;
        }
        this.#headers = Object.freeze(this.#headers)
    }
    get name() {
        return this.#name;
    }
    get headers() {
        return this.#headers;
    }
    get count() {
        return this.#records.length;
    }
    get first() {
        return this.index(0);
    }
    get last() {
        return this.index(-1);
    }
    get all() {
        return this.#records;
    }
    index(n) {
        return this.#records.at(n)
    }
    slice(start, end) {
        return this.#records.slice(start, end)
    }
    match(m) {
        const keys = Object.keys(m);
        return this.#records.find(r => {
            for (const k of keys) {
                if (r[k] !== m[k]) {
                    return false;
                }
            }
            return true;
        })
    }
    matchAll(m) {
        const keys = Object.keys(m);
        return this.#records.filter(r => {
            for (const k of keys) {
                if (r[k] !== m[k]) {
                    return false;
                }
            }
            return true;
        })
    }
    matchBy(m) {
        return this.#records.filter(m);
    }
    relate(table, key) {
        console.log(table, key);
        this.#relations[key] = table;
    }
    relation(key, rec) {
        return this.#relations[key].match({"id":rec[key]});
    }
    relationAll(key, recs) {
        const rel = recs.map(r=>r[key]);
        return this.#relations[key].matchBy(r=>rel.includes(r["id"]));
    }
    /**
     * 
     * @param {string} key 
     * @returns {CSVTable}
     */
    relatedTable(key) {
        return this.#relations[key];
    }
}

class CSVClient {
    #config = { url: "", separator: "", delimiter: "" };
    /**
     * @type {CSVTable}
     */
    #relations = null;
    constructor(url, separator, delimiter) {
        this.#config = { url, separator, delimiter };
    }

    get url() {
        return this.#config.url;
    }

    get sep() {
        return this.#config.separator;
    }

    get dlm() {
        return this.#config.delimiter
    }
    async loadRelations() {
        this.#relations = await this.retrieve(RELATION_TABLE);
    }
    async connect({ loadRelations = false } = {}) {
        const ok = await this.ping();
        if (!ok) {
            throw new CSVPingError("the ping failed");
        }
        if (loadRelations) {
            this.loadRelations();
        }
    }

    async ping() {
        const res = await fetch(`${this.url}/${PING}`);
        return res.ok;
    }

    async retrieve(tableName) {
        console.log(tableName)
        const res = await fetch(`${this.url}/${tableName}.csv`);
        switch (res.status) {
            case 404:
                throw new CSVNotFoundError(tableName);
            case 200:
                return new CSVTable(tableName, await res.text(), this.#config.separator, this.#config.delimiter);
            default:
                throw new CSVUnexpectedError(`the csv '${tableName}' could not be retrieve: http status ${res.status}`)
        }
    }
    /**
     * 
     * @param {CSVTable} table 
     * @param {string} key
     */
    async relate(table, key) {
        if (this.#relations === null) {
           await this.loadRelations();
        }
        const relation = this.#relations.match({ "name": table.name, key })
        if (relation === undefined) {
            throw new CSVNoRelationError(`the ${table.name} is not related to anything`)
        }
        table.relate(await this.retrieve(relation["related"]), key);
    }
}
