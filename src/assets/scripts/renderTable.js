import data from "@assets/data.json";
import commonParams from "@scripts/commonParams";
import getCurrentData from "@scripts/currentData";
import hideHiddenColumns from "@scripts/hideColumn";

const $tableBody = document.querySelector(".table-body");
const $pageList = document.querySelector(".page-list");
const $personOnPage = document.querySelector(".person-on-page");

/*Главная функция, отвечающая за отрисовку главной части таблицы.
По умолчанию берет значения из объекта с общими значениями, 
но в некоторых местах вызывается с номером текущей страницы,
например, в функции перелистывания страниц*/
export function renderTablePage(page = commonParams.currentPage, elemOnPage = commonParams.elemOnPage) {
  renderPageList(page, Math.ceil(data.length / elemOnPage));// Вызывается функция для отрисовки номеров страниц

  /*Функция getCurrentData() возвращает текущий кусок массива данных,
  включая и измененные данные из Localstorage,
  а также если какой то столбец является отсортированным, 
  то возвращает заранее отсортированный массив*/
  const partOfData = getCurrentData(); 
  $tableBody.innerHTML = "";
  partOfData.forEach((elem) => {
    let {
      name: { firstName, lastName },
      id,
      about,
      eyeColor,
    } = elem; //Диструктивным образом инициализирую все необходимые переменные

    //Создал массив объектов, чтобы было удобно заполнить все переменные данные через цикл 
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
  hideHiddenColumns(); // Функция скрывает все столбцы, которые были скрыты до перерисовки таблицы
}

//Функция отрисовывает список номеров страниц под таблицей
function renderPageList(currentPage, pageQuantity) {
  $pageList.innerHTML = "";
  commonParams.currentPage = currentPage; // В объест с общими параметрами записывается новая текущая страница
  if (pageQuantity === 1) return;
  let ul = document.createElement("ul");
  let start, end;
  if (pageQuantity > 5) {
    if (currentPage - 1 > 1 && pageQuantity - currentPage > 1) {
      start = currentPage - 3;
      end = currentPage + 2;
    } else if (currentPage - 1 <= 1) {
      start = 0;
      end = 5;
    } else if (pageQuantity - currentPage <= 1) {
      start = pageQuantity - 5;
      end = pageQuantity;
    }
  } else {
    start = 0;
    end = pageQuantity;
  }

  for (let i = start; i < end; ++i) {
    ul.insertAdjacentHTML("beforeend", `<li class='page-list__number ${i + 1 === currentPage ? "active" : ""}' data-type='page'>${i + 1}</li>`);
  }
  $pageList.append(ul);
  $pageList.insertAdjacentHTML("afterbegin", "<span class='arrow' data-type='arrow' data-arrow='left'>&#9668;</span>");
  $pageList.insertAdjacentHTML("beforeend", "<span class='arrow' data-type='arrow' data-arrow='right'>&#9658;</span>");
}

//Вешается обработчик клика по номеру страницы или стрелке для переключения страницы таблицы
$pageList.addEventListener("click", (evt) => {
  let type = evt.target.dataset.type;
  let currentPage = commonParams.currentPage, //Текущая страница берется из объекта с общими параметрами
    lastPage = +$pageList.querySelector("ul").lastChild.innerText;
  switch (type) {
    case "arrow": {
      let futurePage;
      if (evt.target.dataset.arrow === "left") {
        futurePage = currentPage - 1;
        futurePage >= 1 && renderTablePage(futurePage, commonParams.elemOnPage); // Если текущая страница не первая, то отрисовывается предыдущая страница таблицы
      } else {
        futurePage = currentPage + 1;
        futurePage <= lastPage && renderTablePage(futurePage, commonParams.elemOnPage); // Если текущая страница не последняя, то отрисовывается следующая страница таблицы
      }
      break;
    }
    case "page": {
      renderTablePage(+evt.target.innerText, commonParams.elemOnPage); // Отрисовывается выбранная страница таблицы
      break;
    }
  }
});
// Повесил данный обработчик, чтобы не происходило выделение текста при многократном нажатии на страницы или стрелки
$pageList.addEventListener("mousedown", (evt) => {
  evt.preventDefault();
});

// Обработчик на список количества карточек на стрнице. При выборе одного из элементов, перерисовывает таблицу с новым количеством элементов.
$personOnPage.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("person-on-page__number")) {
    let active = $personOnPage.querySelector(".active");
    active && active.classList.remove("active");
    evt.target.classList.add("active");

    localStorage.setItem("elemOnPage", `${+evt.target.innerText}`);// Текущее количество карточек записывается в хранилище, чтобы оно сохранялось при перезагрузке страницы
    commonParams.updateElemOnPage(); // Функция обновляет текущее количество карточек на странице в общем объкте, так как это приватное поле
    renderTablePage(1, commonParams.elemOnPage);//Таблица перерисовывается, учитвая количество элементов на странице
  }
});
//Функция отмечает текущее количество элементов на странице, при первой загрузке страницы
function selectQuantityPersonsOnPage(num) {
  [...$personOnPage.querySelectorAll(".person-on-page__number")].find((elem) => +elem.innerText === num).classList.add("active");
}

//Функция вызывается один раз при при первой загрузке страницы. Она отрисовывает таблицу с определенным количеством элементов, которое берет из общего объекта
export default function tableGeneration() {
  selectQuantityPersonsOnPage(commonParams.elemOnPage);
  renderTablePage(commonParams.currentPage, commonParams.elemOnPage);
}
