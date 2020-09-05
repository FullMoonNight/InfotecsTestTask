import commonParams from "@scripts/commonParams";
import { renderTablePage } from "@scripts/renderTable";

const $thead = document.querySelector(".table-head");

export default function sort(column, mode, a, b) {
  let switcher = mode === "up" ? 1 : -1;
  switch (column) {
    case 1:
      return a.name.firstName > b.name.firstName ? 1 * switcher : -1 * switcher;
    case 2:
      return a.name.lastName > b.name.lastName ? 1 * switcher : -1 * switcher;
    case 3:
      return a.about > b.about ? 1 * switcher : -1 * switcher;
    case 4:
      return a.eyeColor > b.eyeColor ? 1 * switcher : -1 * switcher;
  }
}

$thead.addEventListener("click", (evt) => {
  let pastActiveElem = $thead.querySelector('[data-sorted="true"');
  let title = evt.target.closest("td");
  if (pastActiveElem && pastActiveElem !== title) {
    pastActiveElem.dataset.sorted = false;
    pastActiveElem.dataset.mode = "down";
    pastActiveElem.querySelector("img").hidden = true;
  }
  title.dataset.sorted = true;
  title.dataset.mode = title.dataset.mode === "down" ? "up" : "down";
  title.querySelector("img").hidden = false;
  title.dataset.mode === "up"
    ? (title.querySelector("img").style.transform = "scaleY(-1) translate(-50%, 150%)")
    : (title.querySelector("img").style.transform = "scaleY(1) translate(-50%)");

  renderTablePage(commonParams.currentPage, commonParams.elemOnPage);
});

$thead.addEventListener("mousedown", (evt) => {
  evt.preventDefault();
});
