import { loadLocalData } from "@scripts/currentData";
import { renderTablePage } from "@scripts/renderTable";

const $tBody = document.querySelector(".table-body");
const $modalWindow = document.querySelector(".modal-window");
const $buttonBlock = $modalWindow.querySelector(".button-block");
const $submitBtn = $modalWindow.querySelector(".submit");
const $cancelBtn = $modalWindow.querySelector(".cancel");
const $modalBg = $modalWindow.querySelector(".modal-window__background");
//Обработцик показывает блок с формой для редактирования определенной строки таблицы при клике на нее же
$tBody.addEventListener("click", async (evt) => {
  let card = evt.target.closest("tr");
  if (card) {
    let [nameElem, surnameElem, aboutElem, colorElem] = card.querySelectorAll("[data-cell]"); //Деструтивным образом получаю ячейки из строки
    let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input"); //Деструтивным образом получаю поля ввода из формы редактирования

    nameInput.value = nameElem.innerHTML;
    surnameInput.value = surnameElem.innerText;
    aboutInput.innerText = aboutElem.querySelector("p").innerText;
    colorInput.value = colorElem.querySelector("div").dataset.color;

    $modalWindow.classList.add("active");
    $modalWindow.querySelector(".tip").hidden = false;
    document.body.style.overflow = "hidden";

    let handler = clickHandler.bind(null, card); //Так как обработчик принимает объект Event, пришлось привязать текущую строку в функцию при помощи bind

    //При каждом новом клике по какой либо строке создается обработчик событий для кнопок в форме,
    //который срабатывает лишь один раз, после чего удаляется
    $buttonBlock.addEventListener("click", handler, { once: true });
  }
});
//При изменении какого либо поля ввода в форме, разблокировать кнопку "Сохранить", если все поля валидны,
//чтобы не сохранять один и тот же объект
$modalWindow.addEventListener("change", (evt) => {
  //проверка полей на валидность
  if (validate()) {
    $submitBtn.disabled = false;
    $modalWindow.querySelector(".tip").hidden = true;
    zeroingValidate();
  } else {
    $submitBtn.disabled = true;
  }
});
//Обработчик нажатия для кнопок в форме
function clickHandler(elem, evt) {
  if (evt.target.tagName === "BUTTON") {
    if (evt.target.dataset.type === "submit") {
      let id = elem.dataset.id;
      let currentObj = loadLocalData().find((elem) => elem.id === id); //Находится текущий изменяемый объект
      let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input");
      let valuesFromInputs = {
        name: {
          firstName: withCapitalLetter(nameInput.value),
          lastName: withCapitalLetter(surnameInput.value),
        },
        about: aboutInput.value.trim(),
        eyeColor: colorInput.value.trim().toLowerCase(),
      };
      //При помощи операторов spread перезаписываются поля старого объекта новыми и получившийся объект сохраняется в локальное хранилще
      localStorage.setItem(id, JSON.stringify({ ...currentObj, ...valuesFromInputs }));
      renderTablePage(); //Перерисовываю таблицу с новыми данными
    }
    $submitBtn.disabled = true;
    $modalWindow.classList.remove("active");
    document.body.style.overflow = "";
    zeroingValidate(); //Запускаю функцию обнуления невалидных статусов при закрытии формы
  }
}
//Обработчик для фона формы, при клике на который форма закрывается так же, как при клиеке на кнопку "Отмена"
$modalBg.addEventListener("click", (evt) => {
  $cancelBtn.dispatchEvent(new Event("click", { bubbles: true }));//Всплытие необходимо, так как обработчик стоит не именно на кнопке, а на родителе
});
//Функция-валидатор. Поля имени, фамилии и цвета проверяются на содержание только букв
function validate() {
  let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input");
  let result = true;
  [nameInput, surnameInput, colorInput].forEach((elem) => {
    let str = elem.value.trim();
    if ((str.match(/[a-z]/gi) || []).length !== str.length || str.length === 0) {
      elem.closest(".input-field").classList.add("no-valid");
      result = false;
    }
  });
  return result;
}
//Функция обнуления статуса невалидных полей
function zeroingValidate() {
  $modalWindow.querySelectorAll(".no-valid").forEach((elem) => elem.classList.remove("no-valid"));
}
//Функция возвращаяе входную строку в нижнем регистре с заглавной буквы для корректного отображения имени и фамилии
function withCapitalLetter(str) {
  let arr = str.trim().toLowerCase().split("");
  arr[0] = arr[0].toUpperCase();
  return arr.join("");
}
