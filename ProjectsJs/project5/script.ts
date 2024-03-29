const container = document.getElementById("root") as HTMLDivElement;
const headline = document.getElementById("headline") as HTMLHeadElement;
const itemList = document.getElementById("items-list") as HTMLUListElement;
const addEntryLstItem = document.getElementById(
  "input-list-item"
) as HTMLDivElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const selectUnits = document.querySelector("select") as HTMLSelectElement;
const entryInput = document.getElementById("item-name") as HTMLInputElement;
const addBtn = document.getElementById("add-item") as HTMLButtonElement;

const defaulSelectValue = "Amount measure";
const MINIMUMLISTLENGTH = 7;

class Entry {
  name: string = "";
  amount: string = "";
  units: string = "";
  text: string = "";
  itemPara: HTMLParagraphElement = document.createElement("p");
  quantityPara: HTMLParagraphElement = document.createElement("p");
  element: HTMLLIElement = document.createElement("li");
  removeBtn: HTMLButtonElement;

  constructor(name: string, amount: string, units: string) {
    this.name = name;
    this.amount = amount;
    this.units = units;
    this.createElement();
  }

  createElement = () => {
    this.text = this.name;
    if (this.amount != "") {
      this.quantityPara.innerText = this.amount + " " + this.units;
      if (this.amount != "1") {
        this.quantityPara.innerText += "s";
      }
    }
    this.itemPara.innerText = this.name;
    this.element.appendChild(this.itemPara);
    this.quantityPara.classList.add("quantity");
    this.element.appendChild(this.quantityPara);
  };

  addRemoveBtn = (button: HTMLButtonElement) => {
    this.removeBtn = button;
    this.element.appendChild(this.removeBtn);
  };
}

class ShoppingList {
  entries: Entry[] = [];

  addEntry(entry: Entry) {
    let removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-entry");
    removeBtn.innerText = "remove";
    entry.addRemoveBtn(removeBtn);
    removeBtn.addEventListener("click", () => {
      this.removeEntry(this.entries.indexOf(entry));
      this.update();
    });
    this.entries.push(entry);
    entry.itemPara.addEventListener("click", () => {
      this.removeEntry(this.entries.indexOf(entry));
      if (entry.itemPara.classList.toggle("cross")) {
        entry.quantityPara.classList.toggle("cross");
        this.entries.push(entry);
      } else {
        this.entries.unshift(entry);
      }
      this.update();
    });
    entry.quantityPara.addEventListener("click", () => {
      this.removeEntry(this.entries.indexOf(entry));
      if (entry.quantityPara.classList.toggle("cross")) {
        entry.itemPara.classList.toggle("cross");
        this.entries.push(entry);
      } else {
        this.entries.unshift(entry);
      }
      this.update();
    });
    this.update();
  }

  removeEntry(index: number) {
    this.entries.splice(index, 1);
  }

  update() {
    amountInput.value = "";
    selectUnits.value = "Amount measure";
    entryInput.value = "";
    itemList.innerHTML = "";
    container.innerHTML = "";
    container.appendChild(headline);
    this.entries.forEach((entry) => {
      itemList.appendChild(entry.element);
    });
    if (this.entries.length <= MINIMUMLISTLENGTH) {
      for (let i = 0; i <= MINIMUMLISTLENGTH - this.entries.length; i++) {
        let emptyRow = document.createElement("li");
        emptyRow.innerHTML = "&#x200B";
        itemList.appendChild(emptyRow);
      }
    }
    container.appendChild(itemList);
    container.appendChild(addEntryLstItem);
    this.save();
  }

  save = () => {
    localStorage.setItem("shoppinglist", JSON.stringify(this.entries));
  };
}

let lst = new ShoppingList();
let savedList: Entry[];
savedList = JSON.parse(localStorage.getItem("shoppinglist") ?? "{}");

if (savedList && savedList.length != 0) {
  savedList = JSON.parse(localStorage.getItem("shoppinglist") ?? "{}");
  savedList.forEach((item) => {
    let savedEntry = new Entry(item.name, item.amount, item.units);
    lst.addEntry(savedEntry);
  });
}

lst.update();

selectUnits.addEventListener("click", () => {
  if (selectUnits.value != defaulSelectValue) {
    amountInput.disabled = false;
  } else {
    amountInput.disabled = true;
  }
});
entryInput.addEventListener("input", () => {
  if (entryInput.value == "") {
    addBtn.disabled = true;
  } else {
    addBtn.disabled = false;
  }
});
addBtn.addEventListener("click", () => {
  let itemName = entryInput.value;
  let amount = amountInput.value;
  let units = selectUnits.value;
  let entry = new Entry(itemName, amount, units);
  lst.addEntry(entry);
});
