import { loadLocalData } from "@scripts/currentData";
import { renderTablePage } from "@scripts/renderTable";

const $tBody = document.querySelector(".table-body");
const $modalWindow = document.querySelector(".modal-window");
const $buttonBlock = $modalWindow.querySelector(".button-block");
const $submitBtn = $modalWindow.querySelector(".submit");
const $cancelBtn = $modalWindow.querySelector(".cancel");
const $modalBg = $modalWindow.querySelector(".modal-window__background");

$tBody.addEventListener("click", async (evt) => {
  let card = evt.target.closest("tr");
  if (card) {
    let [nameElem, surnameElem, aboutElem, colorElem] = card.querySelectorAll("[data-cell]");
    let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input");

    nameInput.value = nameElem.innerHTML;
    surnameInput.value = surnameElem.innerText;
    aboutInput.innerText = aboutElem.querySelector("p").innerText;
    colorInput.value = colorElem.querySelector("div").dataset.color;

    $modalWindow.classList.add("active");
    $modalWindow.querySelector(".tip").hidden = false;
    document.body.style.overflow = "hidden";

    let handler = clickHandler.bind(null, card);
    $buttonBlock.addEventListener("click", handler, { once: true });
  }
});

$modalWindow.addEventListener("change", (evt) => {
  if (validate()) {
    $submitBtn.disabled = false;
    $modalWindow.querySelector(".tip").hidden = true;
    zeroingValidate();
  } else {
    $submitBtn.disabled = true;
  }
});

function clickHandler(elem, evt) {
  if (evt.target.tagName === "BUTTON") {
    if (evt.target.dataset.type === "submit") {
      let id = elem.dataset.id;
      let currentObj = loadLocalData().find((elem) => elem.id === id);
      let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input");
      let valuesFromInputs = {
        name: {
          firstName: withCapitalLetter(nameInput.value),
          lastName: withCapitalLetter(surnameInput.value),
        },
        about: aboutInput.value.trim(),
        eyeColor: colorInput.value.trim().toLowerCase(),
      };
      localStorage.setItem(id, JSON.stringify({ ...currentObj, ...valuesFromInputs }));
      renderTablePage();
    }
    $submitBtn.disabled = true;
    $modalWindow.classList.remove("active");
    document.body.style.overflow = "";
    zeroingValidate();
  }
}

$modalBg.addEventListener("click", (evt) => {
  $cancelBtn.dispatchEvent(new Event("click", { bubbles: true }));
});

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

function zeroingValidate() {
  $modalWindow.querySelectorAll(".no-valid").forEach((elem) => elem.classList.remove("no-valid"));
}

function withCapitalLetter(str) {
  let arr = str.trim().toLowerCase().split("");
  arr[0] = arr[0].toUpperCase();
  console.log(typeof arr[0]);
  return arr.join("");
}
