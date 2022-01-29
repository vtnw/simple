let list = [];
let filteredList = [];
let storageKey = "list2.0";
let filterKey = "filter";
let filter = {};
let yesNoOptions = ["Yes", "No"];
let categories = ["Monthly", "Mid-Month", "Pongal", "Chathurthi", "Pooja", "Diwali", "Birthday", "Karthigai"];
let types = ["Drink", "Grocery Flour", "Grocery Main", "Grocery Readymade", "Grocery Mix", "Grocery Masala", "Grocery Fry", "Grocery Spice", "Grocery Other", "Frozen", "Plastic", "Stationary", "Snack", "Home Need", "Cleaning", "Cosmetics"];
let frequencies = ["Frequent", "Regular", "Often", "Rare", "Never"];

let ddlSort = document.getElementById("ddlSort");
let ddlTypesFilter = document.getElementById("ddlTypesFilter");
let ddlCategoriesFilter = document.getElementById("ddlCategoriesFilter");
let ddlFrequenciesFilter = document.getElementById("ddlFrequenciesFilter");
let ddlSelectedFilter = document.getElementById("ddlSelectedFilter");
let ddlLastBoughtFilter = document.getElementById("ddlLastBoughtFilter");
let dvItems = document.getElementById("dvItems");
let dvList = document.getElementById("dvList");
let dvDetail = document.getElementById("dvDetail");
let btnAdd = document.getElementById("btnAdd");
let btnHome = document.getElementById("btnHome");
let btnNext = document.getElementById("btnNext");
let btnPrevious = document.getElementById("btnPrevious");
let btnReset = document.getElementById("btnReset");
let btnExport = document.getElementById("btnExport");
let btnBackup = document.getElementById("btnBackup");
let btnRestore = document.getElementById("btnRestore");
let ddlTypes = document.getElementById("ddlTypes");
let ddlFrequencies = document.getElementById("ddlFrequencies");
let cbSelected = document.getElementById("cbSelected");
let dvCategories = document.getElementById("dvCategories");
let tbId = document.getElementById("tbId");
let tbName = document.getElementById("tbName");
let tbComment = document.getElementById("tbComment");
let tbSearch = document.getElementById("tbSearch");
let tbQuantity = document.getElementById("tbQuantity");
let fileRestore = document.getElementById("fileRestore");
let btnClear = document.getElementById("btnClear");
let btnMore = document.getElementById("btnMore");
let imgMore = document.getElementById("imgMore");
let spnCount = document.getElementById("spnCount");

let editItem = {};

window.addEventListener("load", (event) => {
    initialize();
});

function initialize() {
    restore();
    restoreFilter();
    filterList();
    bindList();
    bindDdls();
    show(dvDetail, false);
    show(fileRestore, false);
    show(btnBackup, false);
    show(btnRestore, false);
    show(btnClear, false);
    
    types.sort();
    categories.sort();
    frequencies.sort();

    ddlSort.addEventListener("change", () => {
        sort(ddlSort.value);
    });
    ddlTypesFilter.addEventListener("change", () => {
        setFilter("type", ddlTypesFilter.value);
    });
    ddlCategoriesFilter.addEventListener("change", () => {
        setFilter("category", ddlCategoriesFilter.value);
    });
    ddlFrequenciesFilter.addEventListener("change", () => {
        setFilter("frequency", ddlFrequenciesFilter.value);
    });
    ddlSelectedFilter.addEventListener("change", () => {
        setFilter("selected", ddlSelectedFilter.value);
    });
    ddlLastBoughtFilter.addEventListener("change", () => {
        setFilter("lastBought", ddlLastBoughtFilter.value);
    });

    btnAdd.addEventListener("click", () => {
        open(getNewItem());
        show(dvList, false);
        show(dvDetail, true);
        show(btnPrevious, false);
        show(btnNext, false);
    });

    btnHome.addEventListener("click", () => {
        navigate(0);
    });

    btnReset.addEventListener("click", () => {
        list.forEach(item => {
            item.lastBought = item.selected;
            item.selected = false;
        });

        save();
        filterList();
        bindList();
    });

    tbSearch.addEventListener("keyup", () => {
        setFilter("name", tbSearch.value);
    });

    tbSearch.addEventListener("search", () => {
        setFilter("name", tbSearch.value);
    });

    btnClear.addEventListener("click", () => {
        clear();
    });

    btnPrevious.addEventListener("click", () => {
        navigate(-1);
    });

    btnNext.addEventListener("click", () => {
        navigate(1);
    });

    btnExport.addEventListener("click", () => {
        exportToFile();
    });

    btnBackup.addEventListener("click", () => {
        backupToFile();
    });

    btnRestore.addEventListener("click", () => {
        fileRestore.click();
    });

    btnMore.addEventListener("click", () => {
        let file = "less";
        let visibile = true;
        if (imgMore.src.indexOf(file) >= 0) {
            file = "more";
            visibile = false;
        }

        show(btnBackup, visibile);
        show(btnRestore, visibile);
        show(btnClear, visibile);
        show(btnReset, !visibile);
        show(btnExport, !visibile);
        show(btnAdd, !visibile);

        imgMore.src = "images/" + file + ".png";
    });

    fileRestore.addEventListener("change", () => {
        restoreFromFile();
    });
}

function show(element, visibile) {
    element.style.display = visibile ? "inline-block" : "none";
}

function bindDdls() {
    ["Created", "Name", "Type", "Frequency", "Selected"].forEach(type => {
        ddlSort.options[ddlSort.options.length] = new Option(type, type == "Created" ? "id" : type.toLowerCase());
    });
    ddlSort.value = filter.sort;

    getTypes().forEach(type => {
        ddlTypes.options[ddlTypes.options.length] = new Option(type, type);
    });

    getFrequencies().forEach(type => {
        ddlFrequencies.options[ddlFrequencies.options.length] = new Option(type, type);
    });

    ddlTypesFilter.options[ddlTypesFilter.options.length] = new Option("All", "All");
    getTypes().forEach(type => {
        ddlTypesFilter.options[ddlTypesFilter.options.length] = new Option(type, type);
    });
    ddlTypesFilter.value = filter.type;

    ddlCategoriesFilter.options[ddlCategoriesFilter.options.length] = new Option("All", "All");
    getCategories().forEach(type => {
        ddlCategoriesFilter.options[ddlCategoriesFilter.options.length] = new Option(type, type);
    });
    ddlCategoriesFilter.value = filter.category;

    ddlFrequenciesFilter.options[ddlFrequenciesFilter.options.length] = new Option("All", "All");
    getFrequencies().forEach(type => {
        ddlFrequenciesFilter.options[ddlFrequenciesFilter.options.length] = new Option(type, type);
    });
    ddlFrequenciesFilter.value = filter.frequency;

    ddlSelectedFilter.options[ddlSelectedFilter.options.length] = new Option("All", "All");
    yesNoOptions.forEach(type => {
        ddlSelectedFilter.options[ddlSelectedFilter.options.length] = new Option(type, type);
    });
    ddlSelectedFilter.value = filter.selected;

    ddlLastBoughtFilter.options[ddlLastBoughtFilter.options.length] = new Option("All", "All");
    yesNoOptions.forEach(type => {
        ddlLastBoughtFilter.options[ddlLastBoughtFilter.options.length] = new Option(type, type);
    });
    ddlLastBoughtFilter.value = filter.lastBought;

    bindCategories([]);
}

function bindCategories(categories) {
    dvCategories.innerText = "";
    getCategories().forEach(category => {
        let dv = document.createElement("div");

        let cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("id", "cb" + category);
        cb.checked = categories.includes(category);

        let lb = document.createElement("label");
        lb.htmlFor = cb.id;
        lb.appendChild(document.createTextNode(category));

        dv.appendChild(cb)
        dv.appendChild(lb)
        dvCategories.appendChild(dv);
    });
}

function bindList() {
    spnCount.innerText = "(" + filteredList.length + ")";
    dvItems.innerText = "";
    filteredList.forEach(item => {
        let dvRow = document.createElement("div");
        dvRow.className = "row";

        let dvColumn = document.createElement("div");
        dvColumn.className = "checkbox";

        let cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("itemId", item.id);
        cb.id = "cbSelected" + item.id;
        cb.checked = item.selected;
        cb.addEventListener("click", function () {
            let item = list.find(fl => fl.id == this.getAttribute("itemId"));
            item.selected = this.checked;
            save();
        });

        dvColumn.appendChild(cb);
        dvRow.appendChild(dvColumn);

        dvColumn = document.createElement("div");
        dvColumn.className = "name";
        dvColumn.addEventListener("click", () => {
            show(btnPrevious, true);
            show(btnNext, true);
            open(item);
        });

        let spn = document.createElement("span");
        spn.setAttribute("itemId", item.id);
        spn.id = "tbName" + item.id;
        spn.innerText = item.name + " (" + item.comment + ") - " + item.quantity;

        dvColumn.appendChild(spn);
        dvRow.appendChild(dvColumn);

        dvItems.appendChild(dvRow);
    });
}

function sort(field) {
    filteredList.sort((a, b) => {
        return a[field].toString().localeCompare(b[field].toString());
    });
    filter.sort = field;
    saveFilter();
    bindList();
}

function update() {
    if (tbName.value == "") {
        removeItem();
        return;
    }

    editItem.name = tbName.value;
    editItem.comment = tbComment.value;
    editItem.quantity = tbQuantity.value;
    editItem.type = ddlTypes.options[ddlTypes.selectedIndex].value;
    editItem.frequency = ddlFrequencies.options[ddlFrequencies.selectedIndex].value;
    editItem.selected = cbSelected.checked;
    editItem.categories = [];
    getCategories().forEach(category => {
        if (document.getElementById("cb" + category).checked) {
            editItem.categories.push(category);
        }
    });

    if (editItem.id == 0) {
        addItem(editItem);
    }

    save();
}

function open(item) {
    editItem = item;
    tbId.value = editItem.id;
    tbName.value = editItem.name;
    tbComment.value = editItem.comment;
    tbQuantity.value = editItem.quantity;
    ddlTypes.value = editItem.type;
    ddlFrequencies.value = editItem.frequency;
    cbSelected.checked = editItem.selected;
    bindCategories(editItem.categories);

    show(dvList, false);
    show(dvDetail, true);
}

function getNewItem() {
    return {
        id: 0,
        name: "",
        comment: "",
        quantity: "",
        type: "Grocery Main",
        categories: ["Monthly"],
        frequency: "Regular",
        lastBought: false,
        selected: false
    };
}

function getDefaultFilter() {
    return {
        lastBought: "All",
        selected: "All",
        frequency: "All",
        type: "All",
        category: "All",
        name: "",
        sort: "created"
    };
}

function addItem(item) {
    let ids = list.map(listItem => listItem.id);
    item.id = (ids.length > 0 ? Math.max(...ids) : 0) + 1;
    list.push(item);
    filterList();
}

function removeItem() {
    let index = list.findIndex(listItem => listItem.id == editItem.id);
    if (index >= 0) {
        list.splice(index, 1);
        save();
    }
}

function clear() {
    list = [];
    filter = {};
    save();
    saveFilter();
    filterList();
    bindList();
}

function navigate(step) {
    update();
    let index = filteredList.findIndex(item => item.id == editItem.id);
    if (step == -1 && index > 0) {
        editItem = filteredList[index - 1];
        open(editItem);
    } else if (step == 1 && index < filteredList.length - 1) {
        editItem = filteredList[index + 1];
        open(editItem);
    } else if (step == 0) {
        show(dvList, true);
        show(dvDetail, false);
        filterList();
        bindList();
    }
}

function getTypes() {
    return types;
}

function getCategories() {
    return categories;
}

function getFrequencies() {
    return frequencies;
}

function filterList() {
    filteredList = list.filter(item => (filter.lastBought == "All" || item.lastBought == (filter.lastBought == "Yes")) &&
        (filter.selected == "All" || item.selected == (filter.selected == "Yes")) &&
        (filter.frequency == "All" || item.frequency == filter.frequency) &&
        (filter.type == "All" || item.type == filter.type) &&
        (filter.category == "All" || item.categories.includes(filter.category)) &&
        (filter.name == "" || item.name.toLowerCase().indexOf(filter.name.toLowerCase()) >= 0));
}

function setFilter(key, value) {
    filter[key] = value;
    saveFilter();
    filterList();
    bindList();
}

function restoreFromFile() {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var importedData = JSON.parse(event.target.result);
        list = [];
        for (i = 0; i < importedData.length; i++) {
            importedData[i].id = i + 1;
            list.push(importedData[i]);
        }

        save();
        filterList();
        bindList();
        fileRestore.value = "";
    };
    fileReader.readAsText(fileRestore.files[0], "UTF-8");
}

function exportToFile() {
    let data = "";
    list.forEach(item => {
        let entry = item.name;
        entry += item.comment ? " (" + item.comment + ")" : "";
        entry += item.quantity ? " - " + item.quantity : "";
        data += entry + "\r\n";
    });

    saveAsFile(data, "List " + getFormattedDate());
}

function backupToFile() {
    saveAsFile(JSON.stringify(list), "ListBackup_" + getFormattedDate());
}

function saveAsFile(data, fileName) {
    let a = document.createElement("a");
    a.download = fileName;
    a.innerHTML = "export";
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
}

function getFormattedDate() {
    var d = new Date();
    d = d.getFullYear()
        + ("0" + (d.getMonth() + 1)).slice(-2)
        + ("0" + d.getDate()).slice(-2)
        + ("0" + d.getHours()).slice(-2) + " "
        + ("0" + d.getMinutes()).slice(-2)
        + ("0" + d.getSeconds()).slice(-2);
    return d;
}

function save() {
    localStorage.setItem(storageKey, JSON.stringify(list));
}

function restore() {
    var items = JSON.parse(localStorage.getItem(storageKey));
    list = items ? items : [];
}

function saveFilter() {
    localStorage.setItem(filterKey, JSON.stringify(filter));
}

function restoreFilter() {
    var item = JSON.parse(localStorage.getItem(filterKey));
    filter = item ? item : getDefaultFilter();
}
