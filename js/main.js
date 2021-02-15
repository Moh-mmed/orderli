const newColumnBtn = document.getElementById("add-column-btn");
const closeNewColumnOverlay = document.getElementById("close-column");
const newColumn = document.getElementById("add-column");
const saveColumn = document.getElementById("save-column");
const mainBoardList = document.querySelector(".drag-container .drag-list");
let allColums = {};
let addContainer = '';
let editedItemId = '';

let columnNameForEditedItem = '';
// Append All Columns and their lists into main board
window.onload = function() {
    if (localStorage.getItem("allColumns")) {
        allColums = JSON.parse(localStorage.getItem("allColumns"));
        getAllColumnsFromLocalStorage(allColums);
    }
};

function getAllColumnsFromLocalStorage(obj) {
    for (key in obj) {
        createNewColumn(key, obj);
    }
}
//Create a single list item inside a column list
function createNewColumn(columnTitle, object = null) {
    columnTitleJoined = columnTitle.replace(" ", "-");
    let list = document.createElement('li');
    list.classList.add("drag-column");
    list.setAttribute("id", "drag-column");
    list.setAttribute("data-column", columnTitle);
    let deleteColumnBtn = document.createElement('i');
    deleteColumnBtn.className = "fas fa-trash-alt";
    deleteColumnBtn.setAttribute("id", "delete-column");
    deleteColumnBtn.addEventListener("click", (e) => {
        deleteColumn(e);
    });
    list.appendChild(deleteColumnBtn);
    let newSpan = document.createElement('span');
    newSpan.classList.add('header')
    let newHeader = document.createElement('h2');
    newHeader.textContent = columnTitle.toLowerCase();
    newSpan.appendChild(newHeader);
    list.appendChild(newSpan);
    let newDivContent = document.createElement('div');
    newDivContent.classList.add('custom-scroll');
    newDivContent.setAttribute("id", `${columnTitleJoined}-content`);
    let itemsList = document.createElement("ul");
    itemsList.addEventListener('dragover', (e) => allowDrop(e));
    itemsList.addEventListener("dragenter", (e) => dragEnter(e));
    itemsList.addEventListener("dragleave", (e) => dragLeave(e));
    itemsList.addEventListener("drop", (e) => drop(e));
    itemsList.className = "drag-item-list";
    if (object !== null) {
        object[columnTitle].forEach((content, index) => {
            itemsList.appendChild(addItem(content, index));
        });
    }
    newDivContent.appendChild(itemsList);
    list.appendChild(newDivContent);
    let addBtnContainer = document.createElement('div');
    addBtnContainer.className = "add-btn";
    addBtnContainer.setAttribute("id", "add-btn");
    let plusIcon = document.createElement('i');
    plusIcon.className = "fas fa-plus";
    addBtnContainer.appendChild(plusIcon);
    let innerSpan = document.createElement("span");
    innerSpan.textContent = "Add Item";
    addBtnContainer.appendChild(innerSpan);
    addBtnContainer.addEventListener("click", (e) => {
        showAddItem(e);
    });
    list.appendChild(addBtnContainer);



    let addTextContainer = document.createElement("div");
    addTextContainer.className = "add-container";
    addTextContainer.setAttribute("id", "add-container");
    let closeNewItem = document.createElement("i");
    closeNewItem.className = "fas fa-times";
    closeNewItem.setAttribute("id", "close-new-item");
    closeNewItem.addEventListener("click", (e) => {
        e.target.closest(".add-container").style.display = "none";
    });
    addTextContainer.appendChild(closeNewItem);
    let addItemDiv = document.createElement("div");
    addItemDiv.className = "add-item";
    let textArea = document.createElement('textarea');
    textArea.setAttribute('id', 'new-text')
    addItemDiv.appendChild(textArea);
    let saveBtn = document.createElement('div')
    saveBtn.className = "save-btn";
    saveBtn.setAttribute("id", "save-btn");
    saveBtn.textContent = "Save Item";
    saveBtn.addEventListener("click", (e) => {
        saveItem(e);
    });
    addItemDiv.appendChild(saveBtn);
    addTextContainer.appendChild(addItemDiv);
    list.appendChild(addTextContainer);


    let editTextContainer = document.createElement("div");
    editTextContainer.className = "edit-container";
    editTextContainer.setAttribute("id", "edit-container");
    let closeEditItem = document.createElement("i");
    closeEditItem.className = "fas fa-times";
    closeEditItem.setAttribute("id", "close-edit-item");
    closeEditItem.addEventListener("click", (e) => {
        e.target.closest(".edit-container").style.display = "none";
    });
    editTextContainer.appendChild(closeEditItem);
    let editItemDiv = document.createElement("div");
    editItemDiv.className = "edit-item";
    let editTextArea = document.createElement("textarea");
    editTextArea.setAttribute("id", "edit-text");
    editItemDiv.appendChild(editTextArea);
    let editBtn = document.createElement("div");
    editBtn.className = "edit-btn";
    editBtn.setAttribute("id", "edit-btn");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (e) => {
        editItem(e);
    });
    editItemDiv.appendChild(editBtn);
    editTextContainer.appendChild(editItemDiv);
    list.appendChild(editTextContainer);
    mainBoardList.appendChild(list);
}
// Creating one single item and return it 
function addItem(content, index) {
    let item = document.createElement("li");
    let textcontent = document.createTextNode(content);
    let deleteBtn = document.createElement("i");
    item.setAttribute("id", index);
    item.classList.add("drag-item");
    item.setAttribute("draggable", "true");
    item.setAttribute("title", 'Drag and Drop or double click to Edit');
    item.addEventListener('dragstart', e => dragStart(e))
    item.addEventListener("dragend", (e) => dragEnd(e));
    item.addEventListener("dblclick", (e) => showEditItem(e));
    deleteBtn.className = "fas fa-times";
    deleteBtn.setAttribute("id", "delete-item");
    deleteBtn.addEventListener("click", (e) => {
        deleteItem(e);
    });
    item.appendChild(textcontent);
    item.appendChild(deleteBtn);
    return item;
}
// Drag functions

function allowDrop(e) {
    e.preventDefault();
}

function dragStart(event) {
    let data = {
        itemID: event.target.id,
        currColumn: event.target.parentNode.closest("li").getAttribute("data-column")
    }
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    event.target.style.backgroundColor = "rgb(214 214 214 / 28%)";
}

function dragEnter(e) {
    e.preventDefault();
    if (e.target.nodeName !== "LI") {
        e.target.parentNode.closest("li").style.backgroundColor = "rgb(0 0 0 / 14%)";
    }
}

function dragLeave(e) {
    e.target.parentNode.closest("li").style.backgroundColor = "rgba(0, 0, 0, 0.4)";
}

function dragEnd(e) {
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
}

function drop(event) {
    event.preventDefault();
    event.target.parentNode.closest("li").style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    if (event.target.nodeName !== 'LI') {
        let data = JSON.parse(event.dataTransfer.getData("text/plain"));
        let prevColumnName = data['currColumn'];
        let itemId = data['itemID'];
        let recipientColumnName = event.target.parentNode.closest("li").getAttribute("data-column");
        let prevColumn = document.querySelector(
            `[data-column='${prevColumnName}']`
        );
        let recipColumn = document.querySelector(
            `[data-column='${recipientColumnName}']`
        );
        let item = prevColumn.querySelector("ul").children[itemId];
        if (recipientColumnName !== prevColumnName) {
            event.target.appendChild(item);
            //update object
            allColums[recipientColumnName].push(item.textContent);
            allColums[prevColumnName].splice(itemId, 1);
            // update items IDs
            //previous column
            Array.from(prevColumn.querySelector("ul").children).forEach(
                (item, index) => {
                    item.setAttribute("id", index);
                }
            );
            //recipient column
            Array.from(recipColumn.querySelector("ul").children).forEach(
                (item, index) => {
                    item.setAttribute("id", index);
                }
            );
            //Update local storage and allColumns object
            updateLocaleStorage();
        }
    }
}
// Add New Column
newColumnBtn.addEventListener("click", () => {
    newColumn.style.display = 'flex';
    document.querySelector("#heading").focus();
});
// Save New Column
saveColumn.addEventListener("click", saveNewColumn);

function saveNewColumn() {
    let input = newColumn.querySelector("#heading");
    let title = input.value.trim().toLowerCase();
    let checkIfExists = false;

    for (key in allColums) {
        if (key === title) {
            checkIfExists = true;
        }
    }
    if (!checkIfExists &&
        title !== "" &&
        newColumn.style.display === "flex"
    ) {
        createNewColumn(title);
        allColums[title] = [];
        updateLocaleStorage();
        input.value = "";
        newColumn.style.display = "none";
    } else {
        if (title === "") {
            alert("Title Cannot Be Empty!");
            document.querySelector("#heading").focus();
        } else {
            alert("Column Title Exists!");
            document.querySelector("#heading").focus();
        }
    }

}
//Update Local Storage
function updateLocaleStorage() {
    localStorage.setItem("allColumns", JSON.stringify(allColums));
}
// close new column overlay
closeNewColumnOverlay.addEventListener('click', e => {
    newColumn.style.display = "none";
    //reset the input field
    newColumn.querySelector("#heading").value = '';
})

//Show add item functionality
function showAddItem(btn) {
    let parentList = btn.target.closest("li");
    parentList.querySelector("#add-container").style.display = "flex";
    parentList.querySelector("#new-text").focus();
}


//save item functionality
function saveItem(btn) {
    let column = btn.target.closest("li");
    let columnName = column.getAttribute("data-column").toLowerCase();
    let listColumn = column.querySelector(".drag-item-list");
    let index = allColums[columnName].length;
    let textarea = column.querySelector("#new-text");
    let content = textarea.value.trim();
    if (content !== '') {
        allColums[columnName].push(content);
        let newItem = addItem(content, index);
        //Append item to the list and reset
        listColumn.appendChild(newItem);
        btn.target.closest(".add-container").style.display = "none";
        textarea.value = "";
        updateLocaleStorage();
    } else {
        alert('Item Cannot be Empty');
        textarea.focus();
    }
}


// Edit item functions
function editItem(btn) {
    let textarea = btn.target.parentNode.querySelector("#edit-text");
    let content = textarea.value.trim();
    if (content !== "") {
        document
            .querySelector(`li[data-column="${columnNameForEditedItem}"]`)
            .querySelector("ul").children[editedItemId].textContent = content;
        // //Append item to the list and reset
        allColums[columnNameForEditedItem][editedItemId] = content;
        btn.target.closest('.edit-container').style.display = "none";
        textarea.value = "";
        updateLocaleStorage();
    } else {
        alert("Item Cannot be Empty");
        textarea.focus();
    }

};

//Show edit item functionality
function showEditItem(btn) {
    if (btn.target.nodeName === "LI") {
        let parentList = btn.target.parentNode.closest("li");
        columnNameForEditedItem = parentList.getAttribute("data-column").toLowerCase();
        editedItemId = btn.target.getAttribute('id')
        let itemContent = btn.target.textContent;
        let textArea = parentList.querySelector("#edit-text")
        parentList.querySelector("#edit-container").style.display = "flex";
        textArea.focus();
        textArea.value = itemContent
    }
}

// Delete column function
function deleteColumn(element) {
    let parentNode = element.target.closest("li");
    delete allColums[parentNode.getAttribute("data-column").toLowerCase()];
    updateLocaleStorage();
    parentNode.style.backgroundColor = "#f911119c";
    setTimeout(() => {
        parentNode.remove();
    }, 1000)
}
// Delete an item from list function
function deleteItem(element) {
    let grandParentNode = element.target.closest("#drag-column");
    let parentNode = element.target.closest("li");
    allColums[`${grandParentNode.getAttribute("data-column")}`].splice(parentNode.id, 1)
    updateLocaleStorage();
    parentNode.style.backgroundColor = "#f911119c";
    setTimeout(() => {
        parentNode.remove();
    }, 1000)
}