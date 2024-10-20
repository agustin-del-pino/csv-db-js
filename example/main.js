const conn = new CSVClient("https://raw.githubusercontent.com/agustin-del-pino/csv-db-js/refs/heads/main/example/db", ",", "\n");
const jobs = document.querySelector("#jobs");
const employees = document.querySelector("#employees");
const jobPreview = document.querySelector("#job-preview");

const jobContainer = (name) => {
    const span = document.createElement("span");
    span.className = "job";
    span.textContent = name;
    return span;
}
const employeeContainer = (name, email, job) => {
    const div = document.createElement("div");
    div.className = "employee";
    const spanName = document.createElement("span");
    spanName.textContent = name;
    spanName.className = "name"
    div.appendChild(spanName);
    const spanEmail = document.createElement("span");
    spanEmail.textContent = email;
    spanEmail.className = "email"
    div.appendChild(spanEmail);

    const spanJob = document.createElement("span");
    spanJob.textContent = "See job";
    spanJob.className = "see-job"
    spanJob.setAttribute("job", job)
    spanJob.addEventListener("click", ({ target }) => {
        jobPreview.textContent = target.getAttribute("job");
    })
    div.appendChild(spanJob);

    return div;
};

(async () => {
    await conn.connect({ loadRelations: true });

    const tableA = await conn.retrieve("tableA");
    await conn.relate(tableA, "job");
    tableA.relatedTable("job").all.forEach(r => {
        jobs.appendChild(jobContainer(r["name"]))
    });
    tableA.all.forEach(r => {
        const { name, email } = r;
        const job = tableA.relation("job", r);
        employees.appendChild(employeeContainer(name, email, job["name"]));
    });
})();
