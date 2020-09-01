import data from "@assets/data.json";
import conf from "@scripts/configuration";
import { sortData } from "@scripts/sortData";

const $tableBody = document.querySelector(".table-body");
const $pageList = document.querySelector(".page-list");
const $personOnPage = document.querySelector(".person-on-page");

export function renderTablePage(page, elemOnPage) {
  renderPageList(page, Math.ceil(data.length / elemOnPage));

  const partOfData = sortData();
  $tableBody.innerHTML = "";
  partOfData.forEach((elem) => {
    let localElem = localStorage.getItem(`${elem.id}`);
    let {
      name: { firstName, lastName },
      id,
      about,
      eyeColor,
    } = localElem ? localElem : elem;

    const params = [
      { value: firstName, class: "name" },
      { value: lastName, class: "surname" },
      { value: about, class: "about" },
      { value: eyeColor, class: "eyeColor" },
    ];

    let tr = document.createElement("tr");
    for (let i = 0; i < 4; ++i) {
      let td = document.createElement("td");
      td.setAttribute("data-type", `${params[i].class}`);
      td.setAttribute("data-cell", `${i + 1}`);
      switch (i) {
        case 2:
          td.insertAdjacentHTML("beforeend", `<p class="text-about">${params[i].value}</p>`);
          break;
        case 3:
          td.insertAdjacentHTML("beforeend", `<div class="eyeColor__color" data-color="${params[i].value}" style="background-color: ${params[i].value}"></div>`);
          break;
        default:
          td.innerText = params[i].value;
          break;
      }
      tr.setAttribute("data-id", `${elem.id}`);
      tr.append(td);
    }
    $tableBody.append(tr);
  });
}

function renderPageList(currentPage, pageQuantity) {
  $pageList.innerHTML = "";
  conf.currentPage = currentPage;
  if (pageQuantity === 1) return;
  let ul = document.createElement("ul");
  for (let i = 0; i < pageQuantity; ++i) {
    ul.insertAdjacentHTML("beforeend", `<li class='page-list__number ${i + 1 === currentPage ? "active" : ""}' data-type='page'>${i + 1}</li>`);
  }
  $pageList.append(ul);
  $pageList.insertAdjacentHTML("afterbegin", "<span class='arrow' data-type='arrow' data-arrow='left'>&#9668;</span>");
  $pageList.insertAdjacentHTML("beforeend", "<span class='arrow' data-type='arrow' data-arrow='right'>&#9658;</span>");
}

$pageList.addEventListener("click", (evt) => {
  let type = evt.target.dataset.type;
  let currentPage = conf.currentPage,
    lastPage = +$pageList.querySelector("ul").lastChild.innerText;
  switch (type) {
    case "arrow": {
      let futurePage;
      if (evt.target.dataset.arrow === "left") {
        futurePage = currentPage - 1;
        futurePage >= 1 && renderTablePage(futurePage, conf.elemOnPage);
      } else {
        futurePage = currentPage + 1;
        futurePage <= lastPage && renderTablePage(futurePage, conf.elemOnPage);
      }
      break;
    }
    case "page": {
      renderTablePage(+evt.target.innerText, conf.elemOnPage);
      break;
    }
  }
});
$pageList.addEventListener("mousedown", (evt) => {
  evt.preventDefault();
});

$personOnPage.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("person-on-page__number")) {
    let active = $personOnPage.querySelector(".active");
    active && active.classList.remove("active");
    evt.target.classList.add("active");

    localStorage.setItem("elemOnPage", `${+evt.target.innerText}`);
    conf.updateElemOnPage();
    renderTablePage(1, conf.elemOnPage);
  }
});

function selectQuantityPersonsOnPage(num) {
  [...$personOnPage.querySelectorAll(".person-on-page__number")].find((elem) => +elem.innerText === num).classList.add("active");
}

export default function tableGeneration() {
  selectQuantityPersonsOnPage(conf.elemOnPage);
  renderTablePage(conf.currentPage, conf.elemOnPage);
}
