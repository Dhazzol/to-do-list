const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEL = document.getElementById("year");
const input = document.getElementById("form-input");
const form = document.getElementById("form");
const tasksHtml = document.getElementById("tasks");
const monthDiv = document.getElementById("month-div");
const dayDiv = document.getElementById("day-div");
const btnAdd = document.getElementById("add-new");
const formElement = document.querySelector(".form-element")
const small = document.getElementsByTagName('small')
const outcome = document.getElementById("outcome")
console.log(small)
const days = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];
const months = [
    { index: 0, m0nth: "January" },
    { index: 1, m0nth: "February" },
    { index: 2, m0nth: "March" },
    { index: 3, m0nth: "April" },
    { index: 4, m0nth: "May" },
    { index: 5, m0nth: "June" },
    { index: 6, m0nth: "July" },
    { index: 7, m0nth: "August" },
    { index: 8, m0nth: "September" },
    { index: 9, m0nth: "October" },
    { index: 10, m0nth: "November" },
    { index: 11, m0nth: "December" },
];
let today = new Date();
console.log(btnAdd.value)

// get current year
function getYear() {
    let yr = today.getFullYear();
    let arrYr = [];
    for (let i = 0; i < 10; i++) {
        arrYr.push(yr + i);
    }
    yearEL.innerHTML = `
    ${arrYr.map((y) => ` <option value="${y}">${y}</option>`)}
    `;
}

//get remainin days in current month
function getRemDays() {
    return days.slice(today.getDate() - 1);
}

//populate dayEl
function get_Date() {
    let remDays = getRemDays();
    dayEl.innerHTML = `
    ${remDays.map((day) => `<option value="${day}">${day}</option>`)}
    `;
}

// get remaining months in current year
function getRemMonths() {
    const d = new Date();
    const rest = months.slice(d.getMonth());
    return rest;
}

// update monthEl
function getCurrMonth() {
    let remMonts = getRemMonths();
    monthEl.innerHTML = `
    ${remMonts.map(
        (month) => `<option value="${month.index}">${month.m0nth}</option>`
    )}
    `;
}

function get_Months(year) {
    if (+year > today.getFullYear()) {
        monthEl.innerHTML = `
        ${months.map(
            (month) => `<option value="${month.index}">${month.m0nth}</option>`
        )}`;
    } else {
        getCurrMonth();
    }
}

// get number of days according to specified month
function daysInMonth(month, year) {
    let daysCount = new Date(year, month, 0).getDate();
    dayEl.innerHTML = "";
    for (let i = 1; i <= daysCount; i++) {
        dayEl.innerHTML += `<option value="${i}">${
            i < 10 ? "0" + i : i
        }</option>`;
    }
}

// make sure date is valid
function validateDate(y, m, d) {
    let date = new Date(y, m, d);
    return date;
}

// retrieve data from local storage
function get_tasks() {
    var tasks = new Array();
    var tasks_json = localStorage.getItem("tasks");
    if (tasks_json !== null) {
        tasks = JSON.parse(tasks_json);
    }
    return tasks;
}


//generate randomID
function generateId() {
    return Math.floor(Math.random() * 1000000000)
}

// save data to local storage
function add() {
    let date = validateDate(year, month, day);
    let taskDes = "";

    if (input.value !== "" && input.value !== null) {
        taskDes = input.value;

        var tasks = get_tasks();

        tasks.push({
            id: generateId(),
            task: taskDes,
            date: date,
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        outcome.innerText = "Successul!!"
        outcome.classList.add("success")
        setTimeout(() => {
            outcome.classList.remove('success');
          }, 2000);
    } else {
        small[0].innerText = "this field cannot be empty"
        formElement.classList.add("error")
        outcome.innerText = "Something went wrong!"
        outcome.classList.add("error")
        
        setTimeout(() => {
            formElement.classList.remove('error');
            outcome.classList.remove('error')
          }, 2000);
    }
    clearDefault();
}

// Delete redundant event
function deletePastEvents() {

}

// populate UI
function display() {
    tasksHtml.innerHTML = "";
    let todos = get_tasks();
    todos.forEach((todo) => {
        let displayDate = new Date(todo.date);
        let displayHtml = document.createElement("div");
        displayHtml.classList.add("task");
        displayHtml.id = `${todo.id}`;
        displayHtml.innerHTML = ` 
        <div class="task-desc">
            <h3 class="task-name">${todo.task}</h3>
        <h3 class="task-date" id="task-date">${
            displayDate.getDate() < 10
                ? "0" + displayDate.getDate()
                : displayDate.getDate()
        }/${
            displayDate.getMonth() + 1 < 10
                ? "0" + (displayDate.getMonth() + 1)
                : displayDate.getMonth() + 1
        }/${displayDate.getFullYear()}</h3>
        </div>
        
        <div class="task-icons">
            <button class="icon btn-edit" id="edit-btn">
                <i class="far fa fa-edit"></i>
            </button>
            <button class="icon btn-delete" id="">
                <i class="far fa-times-circle"></i>
            </button>
        </div>
    `;
        tasksHtml.appendChild(displayHtml);
    });

    let btnEdit = document.querySelectorAll(".btn-edit");
    btnEdit.forEach((btn) => {
        btn.addEventListener("click", function () {
            let id = +this.parentNode.parentNode.id;
            let tasks = get_tasks();
            let task = tasks.filter(task => task.id === id)
            btnAdd.value = "Edit"
            console.log(task)
        });
    });

    let btnDelete = document.querySelectorAll(".btn-delete");
    btnDelete.forEach((btn) =>
        btn.addEventListener("click", function (e) {
            let id = +this.parentNode.parentNode.id;
            let tasks = get_tasks();
            tasks = tasks.filter(task => task.id !== id)

            localStorage.setItem("tasks", JSON.stringify(tasks));
            display();
        })
    );
}

// set app to default settings
function clearDefault() {
    input.value = "";
    getYear();
    getCurrMonth();
    get_Date();
}


//event listeners

dayEl.addEventListener("change", function (e) {
    day = e.target.value;
    validateDate(year, month, day);
});
monthEl.addEventListener("change", function (e) {
    month = e.target.value;
    let inMonth = +month + 1;
    daysInMonth(inMonth, year);
    validateDate(year, month, day);
});
yearEL.addEventListener("change", function (e) {
    year = e.target.value;
    get_Months(year);
    month = 0;
    let inMonth = +month + 1;
    daysInMonth(inMonth, year);
    validateDate(year, month, day);
    console.log(month);
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    add();
    clearDefault();
    display();
});

clearDefault();
let year = yearEL.value;
let day = dayEl.value;
let month = monthEl.value;

display();
