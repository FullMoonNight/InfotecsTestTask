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

    $modalWindow.hidden = false;
    $modalWindow.querySelector(".tip").hidden = false;
    document.body.style.overflow = "hidden";

    let handler = clickHandler.bind(null, card);
    $buttonBlock.addEventListener("click", handler, { once: true });
  }
});

$modalWindow.addEventListener("change", (evt) => {
  $submitBtn.disabled = false;
  $modalWindow.querySelector(".tip").hidden = true;
});

function clickHandler(elem, evt) {
  if (evt.target.tagName === "BUTTON") {
    if (evt.target.dataset.type === "submit") {
      let id = elem.dataset.id;
      let currentObj = loadLocalData().find((elem) => elem.id === id);
      let [nameInput, surnameInput, aboutInput, colorInput] = $modalWindow.querySelectorAll(".input");
      let valuesFromInputs = {
        name: {
          firstName: nameInput.value,
          lastName: surnameInput.value,
        },
        about: aboutInput.value,
        eyeColor: colorInput.value,
      };
      localStorage.setItem(id, JSON.stringify({ ...currentObj, ...valuesFromInputs }));
      renderTablePage();
    }
    $submitBtn.disabled = true;
    $modalWindow.hidden = true;
    document.body.style.overflow = "";
  }
}

$modalBg.addEventListener("click", (evt) => {
  $cancelBtn.dispatchEvent(new Event("click", { bubbles: true }));
});
