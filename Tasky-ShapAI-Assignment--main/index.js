const taskContainer = document.querySelector(".task__container");
const taskmodal = document.querySelector(".task__modal__body");
const searchBar = document.getElementById("searchBar");

let globalTaskData = [];

const generateHTML = (taskData) => {
    return `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card ">
    <div class="card-header d-flex justify-content-end gap-2">
        <button class="btn btn-outline-info" name=${taskData.id} onclick = "editCard.apply(this, arguments)" >
        <i class="fad fa-pencil" name=${taskData.id} ></i></button>
        <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)" >
        <i class="fad fa-trash-alt" name=${taskData.id} ></i></button>
    </div>
    <div class="card-body">
        <img src=${taskData.image}
            alt="image" class="card-img">
        <h5 class="card-title mt-4">
        ${taskData.title}</h5>
        <p class="card-text">
        ${taskData.description}</p>
        <span class="badge bg-primary">${taskData.type}</span>
    </div>
    <div class="card-footer text-muted">
        <button class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this, arguments)" >Open Task</button>
    </div>
</div>
</div> `;
};

const openTaskModal = (taskData) => {
    const date = new Date(parseInt(taskData.id));
    return `<div id=${taskData.id} >
    <img src=${taskData.image} alt="image" class="img-fluid placeholder__image mb-3">
    <strong class=" text-sm text-muted ">Created on ${date.toDateString()}</strong>
    <h2 class="my-3">${taskData.title}</h2>
    <p class="lead">${taskData.description}</p>
</div>`;
};

const insertToDOM = (content) =>
    taskContainer.insertAdjacentHTML("beforeend", content);

const saveToLocalStorage = () => localStorage.setItem("tasky", JSON.stringify({
    cards: globalTaskData
}));

const addNewCard = () => {

    const taskData = {
        id: `${Date.now()}`,
        title: document.getElementById("taskTitle").value,
        image: document.getElementById("ImageUrl").value,
        description: document.getElementById("taskDescription").value,
        type: document.getElementById("taskType").value,

    };

    globalTaskData.push(taskData);

    saveToLocalStorage();

    const newCard = generateHTML(taskData);

    insertToDOM(newCard);

    document.getElementById("taskTitle").value = "";
    document.getElementById("ImageUrl").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskType").value = "";

    return;
};



const loadExistingCadrs = () => {

    const getData = localStorage.getItem("tasky");

    if (!getData) return;

    const taskCards = JSON.parse(getData);

    globalTaskData = taskCards.cards;

    globalTaskData.map((taskData) => {

        const newCard = generateHTML(taskData);


        insertToDOM(newCard);
    });

    return;

};

const deleteCard = (event) => {

    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    const removeTask = globalTaskData.filter((task) => task.id !== targetID);

    globalTaskData = removeTask;

    saveToLocalStorage();

    if (elementType === "BUTTON") {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode
        );
    } else {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode.parentNode
        );
    }

};

const editCard = (event) => {
    const elementType = event.target.tagName;


    let taskTitle;
    let taskType;
    let taskDescription;
    let parentElement;
    let submitButton;

    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;

    }

    taskTitle = parentElement.childNodes[3].childNodes[3];
    taskType = parentElement.childNodes[3].childNodes[7];
    taskDescription = parentElement.childNodes[3].childNodes[5];
    submitButton = parentElement.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.innerHTML = "Save Changes";

};

const saveEdit = (event) => {

    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    let parentElement;

    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;

    }

    const taskTitle = parentElement.childNodes[3].childNodes[3];
    const taskType = parentElement.childNodes[3].childNodes[7];
    const taskDescription = parentElement.childNodes[3].childNodes[5];
    const submitButton = parentElement.childNodes[5].childNodes[1];

    const updateData = {
        title: taskTitle.innerHTML,
        type: taskType.innerHTML,
        description: taskDescription.innerHTML,
    };

    const updateGobalTask = globalTaskData.map((task) => {

        if (task.id === targetID) {
            return {
                ...task,
                ...updateData
            };
        }
        return task;
    });

    globalTaskData = updateGobalTask;

    saveToLocalStorage();


    taskTitle.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    submitButton.innerHTML = "Open task";
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
};

const openTask = (event) => {
    const targetID = event.target.getAttribute("name");

    const getTask = globalTaskData.filter((task) => task.id === targetID);
    taskmodal.innerHTML = openTaskModal(getTask[0]);

};

searchBar.addEventListener("keyup", function (e) {
    if (!e) e = window.event;
    while (taskContainer.firstChild) {
        taskContainer.removeChild(taskContainer.firstChild);
    }
    const searchString = e.target.value;

    const filteredCharacters = globalTaskData.filter((character) => {
        return (
            character.title.includes(searchString) ||
            character.description.includes(searchString) ||
            character.type.includes(searchString)
        );
    });

     filteredCharacters.map((careData) => {

        const filteredCard = generateHTML(careData);

        insertToDOM(filteredCard);
    });
});