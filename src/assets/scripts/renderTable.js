import data from "@assets/data.json";
const $tableBody = document.querySelector(".table-body");

(function renderTable(page = 1, elemOnPage = 10) {
  const partOfData = data.slice((page - 1) * elemOnPage, page * elemOnPage);
  partOfData.forEach((elem, index) => {
    let localElem = localStorage.getItem(`pg${page}-el${index + 1}`);
    let {
      name: { firstName, lastName },
      id,
      about,
      eyeColor,
    } = localElem ? localElem : elem;
    let tr = document.createElement("tr");
    let domClasses = ["name", "surname", "about", "eyeColor"],
      values = [firstName, lastName, about, eyeColor];

    for (let i = 0; i < 4; ++i) {
      let td = document.createElement("td");
      td.setAttribute("data-type", `${domClasses[i]}`);
      td.setAttribute("data-cell", `${i + 1}`);
      if (i === 2) {
        let p = document.createElement("p");
        p.classList.add("text-about");
        p.innerText = values[i];
        td.append(p);
      } else if (i === 3) {
        let colorBlock = document.createElement("div");
        colorBlock.classList.add("eyeColor__color");
        colorBlock.style.backgroundColor = values[i];
        td.append(colorBlock);
      } else {
        td.innerText = values[i];
      }
      tr.append(td);
    }
    $tableBody.append(tr);
  });
})();
