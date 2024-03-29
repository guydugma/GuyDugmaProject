var _a, _b;
var container = document.getElementById("root");
var headline = document.getElementById("headline");
var itemList = document.getElementById("items-list");
var addEntryLstItem = document.getElementById("input-list-item");
var amountInput = document.getElementById("amount");
var selectUnits = document.querySelector("select");
var entryInput = document.getElementById("item-name");
var addBtn = document.getElementById("add-item");
var defaulSelectValue = "Amount measure";
var MINIMUMLISTLENGTH = 7;
var Entry = /** @class */ (function () {
    function Entry(name, amount, units) {
        var _this = this;
        this.name = "";
        this.amount = "";
        this.units = "";
        this.text = "";
        this.itemPara = document.createElement("p");
        this.quantityPara = document.createElement("p");
        this.element = document.createElement("li");
        this.createElement = function () {
            _this.text = _this.name;
            if (_this.amount != "") {
                _this.quantityPara.innerText = _this.amount + " " + _this.units;
                if (_this.amount != "1") {
                    _this.quantityPara.innerText += "s";
                }
            }
            _this.itemPara.innerText = _this.name;
            _this.element.appendChild(_this.itemPara);
            _this.quantityPara.classList.add("quantity");
            _this.element.appendChild(_this.quantityPara);
        };
        this.addRemoveBtn = function (button) {
            _this.removeBtn = button;
            _this.element.appendChild(_this.removeBtn);
        };
        this.name = name;
        this.amount = amount;
        this.units = units;
        this.createElement();
    }
    return Entry;
}());
var ShoppingList = /** @class */ (function () {
    function ShoppingList() {
        var _this = this;
        this.entries = [];
        this.save = function () {
            localStorage.setItem("shoppinglist", JSON.stringify(_this.entries));
        };
    }
    ShoppingList.prototype.addEntry = function (entry) {
        var _this = this;
        var removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-entry");
        removeBtn.innerText = "remove";
        entry.addRemoveBtn(removeBtn);
        removeBtn.addEventListener("click", function () {
            _this.removeEntry(_this.entries.indexOf(entry));
            _this.update();
        });
        this.entries.push(entry);
        entry.itemPara.addEventListener("click", function () {
            _this.removeEntry(_this.entries.indexOf(entry));
            if (entry.itemPara.classList.toggle("cross")) {
                entry.quantityPara.classList.toggle("cross");
                _this.entries.push(entry);
            }
            else {
                _this.entries.unshift(entry);
            }
            _this.update();
        });
        entry.quantityPara.addEventListener("click", function () {
            _this.removeEntry(_this.entries.indexOf(entry));
            if (entry.quantityPara.classList.toggle("cross")) {
                entry.itemPara.classList.toggle("cross");
                _this.entries.push(entry);
            }
            else {
                _this.entries.unshift(entry);
            }
            _this.update();
        });
        this.update();
    };
    ShoppingList.prototype.removeEntry = function (index) {
        this.entries.splice(index, 1);
    };
    ShoppingList.prototype.update = function () {
        amountInput.value = "";
        selectUnits.value = "Amount measure";
        entryInput.value = "";
        itemList.innerHTML = "";
        container.innerHTML = "";
        container.appendChild(headline);
        this.entries.forEach(function (entry) {
            itemList.appendChild(entry.element);
        });
        if (this.entries.length <= MINIMUMLISTLENGTH) {
            for (var i = 0; i <= MINIMUMLISTLENGTH - this.entries.length; i++) {
                var emptyRow = document.createElement("li");
                emptyRow.innerHTML = "&#x200B";
                itemList.appendChild(emptyRow);
            }
        }
        container.appendChild(itemList);
        container.appendChild(addEntryLstItem);
        this.save();
    };
    return ShoppingList;
}());
var lst = new ShoppingList();
var savedList;
savedList = JSON.parse((_a = localStorage.getItem("shoppinglist")) !== null && _a !== void 0 ? _a : "{}");
if (savedList && savedList.length != 0) {
    savedList = JSON.parse((_b = localStorage.getItem("shoppinglist")) !== null && _b !== void 0 ? _b : "{}");
    savedList.forEach(function (item) {
        var savedEntry = new Entry(item.name, item.amount, item.units);
        lst.addEntry(savedEntry);
    });
}
lst.update();
selectUnits.addEventListener("click", function () {
    if (selectUnits.value != defaulSelectValue) {
        amountInput.disabled = false;
    }
    else {
        amountInput.disabled = true;
    }
});
entryInput.addEventListener("input", function () {
    if (entryInput.value == "") {
        addBtn.disabled = true;
    }
    else {
        addBtn.disabled = false;
    }
});
addBtn.addEventListener("click", function () {
    var itemName = entryInput.value;
    var amount = amountInput.value;
    var units = selectUnits.value;
    var entry = new Entry(itemName, amount, units);
    lst.addEntry(entry);
});
