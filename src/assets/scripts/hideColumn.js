import commParams from "@scripts/commonParams";

const $hideMenu = document.querySelector(".hide-menu");
const $table = document.querySelector(".table");

$hideMenu.addEventListener("click", (evt) => {
  let btn = evt.target.closest("li");
  if (btn) {
    let hideStatus = +btn.dataset.hide;
    let column = +btn.dataset.column;
    hideStatus ? show(column) : hide(column);
    btn.dataset.hide ^= 1;

    let msg = btn.querySelector("span").innerText.split(" ");
    hideStatus ? (msg[0] = "Скрыть") : (msg[0] = "Показать");
    btn.querySelector("span").innerText = msg.join(" ");

    btn.querySelector(".open-eye").hidden = !hideStatus;
    btn.querySelector(".close-eye").hidden = !!hideStatus;
  }
});

function hide(column) {
  commParams.addHidingColumns(column);
  $table.querySelectorAll(`[data-cell="${column}"]`).forEach((e) => (e.hidden = true));
}

function show(column) {
  commParams.removeHidingColumns(column);
  $table.querySelectorAll(`[data-cell="${column}"]`).forEach((e) => (e.hidden = false));
}

export default function hideHiddenColumns() {
  commParams.hidingColumns && commParams.hidingColumns.forEach((e) => hide(e));
}
