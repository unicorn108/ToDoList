//#region Init form elements
const todo_desc = document.querySelector("#input-description");
const todo_datetime = document.querySelector("#input-datetime");
const dayHeader = document.querySelector(".day-header");
const dateHeader = document.querySelector(".current-date");
const TabBlocks = document.querySelectorAll(".filter-block>div");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
const toDosContainer = document.querySelector(".todos-list");
const searchTodo = document.querySelector(".search-todo");
setCurrentDate(dayHeader, dateHeader, todo_datetime);
let allTodos = JSON.parse(localStorage.getItem("todos")) || [];
let tabActiveFlag = "all";
//#endregion

let activeTodos = [];
let doneTodos = [];
selectTab();

renderToDoItems(allTodos);

//-------Search input---------
searchTodo.addEventListener("input", (event) => {
  let searchTerm = event.target.value.toLowerCase();
  let todosToSearch = [];

  switch (tabActiveFlag) {
    case "all":
      todosToSearch = allTodos;
      break;
    case "active":
      todosToSearch = activeTodos;
      break;
    case "done":
      todosToSearch = doneTodos;
      break;
  }

  let searchedTodos = todosToSearch.filter((el) =>
    el.description.toLowerCase().includes(searchTerm)
  );

  renderToDoItems(searchedTodos);
});

//------Submit Button Click---
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let id = Math.random().toString(16).slice(2);
  let newToDo = {
    id: id,
    description: todo_desc.value,
    datetime: todo_datetime.value,
    checked: false,
  };
  if (todo_desc.value === "" || todo_datetime.value === "") return;
  allTodos.push(newToDo);
  localStorage.setItem("todos", JSON.stringify(allTodos));
  renderToDoItems(allTodos);
  clearFormInputs();
});

//------Clear Button Click---
clearBtn.addEventListener("click", (event) => {
  event.preventDefault();
  clearFormInputs();
});

function renderToDoItems(toDoList) {
  toDosContainer.innerHTML = "";
  toDoList.forEach((todoItem) => {
    let todoBlock = createTodoItem(
      todoItem.id,
      todoItem.description,
      todoItem.datetime,
      todoItem.checked
    );
    toDosContainer.append(todoBlock);
  });
  ReloadBinIconsCheckboxes();
}

//#region Datetime conversion
function setCurrentDate(header1, header2, dateTimeInput) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDate = new Date();
  let dayofWeek = weekday[currentDate.getDay()];
  let date = currentDate.toLocaleDateString("en-gb", {
    day: "numeric",
    month: "long",
  });
  let year = currentDate.getFullYear();
  let month = zeroPrefix(currentDate.getMonth() + 1);
  let day = zeroPrefix(currentDate.getDate());
  let hours = zeroPrefix(currentDate.getHours());
  let minutes = zeroPrefix(currentDate.getMinutes());
  header1.textContent = dayofWeek;
  header2.textContent = date;
  dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}
function zeroPrefix(number) {
  return number < 10 ? "0" + number : number;
}

function datetimeFormatConverter(dateTimeInput) {
  const date = new Date(dateTimeInput);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let day = date.getDate();
  let monthName = monthNames[date.getMonth()];
  let hours = date.getHours();
  let minutes = zeroPrefix(date.getMinutes());
  return `${day} ${monthName}, ${hours}:${minutes}`;
}
//#endregion

//#region Tab selection
function selectTab() {
  TabBlocks.forEach((tabElement, i) => {
    tabElement.addEventListener("click", () => {
      setTabActiveStyle(tabElement);
      filterTodo(tabElement.className);
      for (let j = 0; j < TabBlocks.length; j++) {
        if (j !== i && TabBlocks[j].style.backgroundColor !== "white") {
          setTabInactiveStyle(TabBlocks[j]);
          break;
        }
      }
    });
  });
}

function setTabActiveStyle(element) {
  let icon = document.querySelector("." + element.className + ">i");
  icon.classList.remove("hidden");
  element.style.backgroundColor = "rgb(232, 222, 248, 1)";
}

function setTabInactiveStyle(element) {
  let icon = document.querySelector("." + element.className + ">i");
  element.style.backgroundColor = "white";
  icon.classList.add("hidden");
}

function filterTodo(className) {
  switch (className) {
    case "box-filter-all":
      renderToDoItems(allTodos);
      tabActiveFlag = "all";
      break;
    case "box-filter-active":
      activeTodos = allTodos.filter((el) => {
        return el.checked === false;
      });
      renderToDoItems(activeTodos);
      tabActiveFlag = "active";
      break;
    case "box-filter-done":
      doneTodos = allTodos.filter((el) => {
        return el.checked === true;
      });
      renderToDoItems(doneTodos);
      tabActiveFlag = "done";
      break;
  }
}

//#endregion

//#region Create Todo Container
function createTodoItem(todo_id, todo_description, todo_datetime, checked) {
  let todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  todoItem.setAttribute("id", todo_id);
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "todo-checkbox");
  todoItem.append(checkbox);
  let textDiv = document.createElement("div");
  let datetimeParag = document.createElement("p");
  datetimeParag.classList.add("todo-datetime");
  datetimeParag.textContent = datetimeFormatConverter(todo_datetime);
  let descParag = document.createElement("p");
  descParag.classList.add("todo-description");
  descParag.textContent = todo_description;
  if (checked) {
    checkbox.checked = true;
    setCheckedStyle(datetimeParag, descParag);
  }
  let binIcon = document.createElement("i");
  binIcon.classList.add("fa-solid");
  binIcon.classList.add("fa-trash");
  textDiv.append(datetimeParag);
  textDiv.append(descParag);
  todoItem.append(textDiv);
  todoItem.append(binIcon);
  return todoItem;
}
//#endregion

//#region Checkbox Click
function checkBoxClick(checkboxes) {
  if (checkboxes.length === 0) return;
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      let idTodoItem = event.target.parentNode.id;
      let todoItemElem = document.querySelector(`[id='${idTodoItem}']`);
      let todoDatetimeElem = todoItemElem.querySelector(".todo-datetime");
      let todoDescriptionElem = todoItemElem.querySelector(".todo-description");
      if (event.currentTarget.checked) {
        setCheckedStyle(todoDatetimeElem, todoDescriptionElem);
        changeTodo(true, idTodoItem);
      } else {
        setUncheckedStyle(todoDatetimeElem, todoDescriptionElem);
        changeTodo(false, idTodoItem);
      }
    });
  });
}

function setCheckedStyle(datetimeElem, descriptionElem) {
  datetimeElem.style.color = "rgb(29, 27, 30, 0.5)";
  descriptionElem.style.color = "rgb(29, 27, 30, 0.5)";
  descriptionElem.style.textDecoration = "line-through";
}

function setUncheckedStyle(datetimeElem, descriptionElem) {
  datetimeElem.style.color = "rgb(29, 27, 30, 1)";
  descriptionElem.style.color = "rgb(29, 27, 30, 1)";
  descriptionElem.style.textDecoration = "none";
}

function changeTodo(checked, id) {
  allTodos.forEach((todo) => {
    if (todo.id === id) {
      todo.checked = checked;
    }
  });
  localStorage.setItem("todos", JSON.stringify(allTodos));
}
//#endregion

//#region Bin Icon click
function removeIconClick(binIcons) {
  if (binIcons.length === 0) return;
  binIcons.forEach((binIcon) => {
    binIcon.addEventListener("click", (event) => {
      const idTodoItem = event.target.parentNode.id;

      allTodos = allTodos.filter((el) => el.id !== idTodoItem);
      localStorage.setItem("todos", JSON.stringify(allTodos));

      let todosToRender;

      switch (tabActiveFlag) {
        case "all":
          todosToRender = allTodos;
          break;
        case "active":
          activeTodos = allTodos.filter((el) => !el.checked);
          todosToRender = activeTodos;
          break;
        case "done":
          doneTodos = allTodos.filter((el) => el.checked);
          todosToRender = doneTodos;
          break;
        default:
          return;
      }

      renderToDoItems(todosToRender);
    });
  });
}
//#endregion

//#region Help Functions
function clearFormInputs() {
  todo_desc.value = "";
  setCurrentDate(dayHeader, dateHeader, todo_datetime);
}

function ReloadBinIconsCheckboxes() {
  let checkboxesTodo = document.querySelectorAll("#todo-checkbox");
  let binIconsTodo = document.querySelectorAll(".fa-trash");
  checkBoxClick(checkboxesTodo);
  removeIconClick(binIconsTodo);
}
//#endregion
