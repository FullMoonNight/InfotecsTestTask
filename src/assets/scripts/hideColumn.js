import commParams from "@scripts/commonParams";

const $hideMenu = document.querySelector(".hide-menu");
const $table = document.querySelector(".table");
//Обработчик определяетт, в каком состоянии находится столбец в данный момент и в последствии скрывает или показывает его
$hideMenu.addEventListener("click", (evt) => {
  let btn = evt.target.closest("li");
  if (btn) {
    let hideStatus = +btn.dataset.hide;
    let column = +btn.dataset.column;
    hideStatus ? show(column) : hide(column); // На основе текущего статуса запускается та или иная функция
    btn.dataset.hide ^= 1;

    let msg = btn.querySelector("span").innerText.split(" ");
    hideStatus ? (msg[0] = "Скрыть") : (msg[0] = "Показать");
    btn.querySelector("span").innerText = msg.join(" ");

    btn.querySelector(".open-eye").hidden = !hideStatus;
    btn.querySelector(".close-eye").hidden = !!hideStatus;
  }
});
//Фукция, скрывающая определенный столбец
function hide(column) {
  commParams.addHidingColumns(column); //Добавляет текущий столбец в список(массив) скрытых общего объекта
  $table.querySelectorAll(`[data-cell="${column}"]`).forEach((e) => (e.hidden = true));
}
//Фукция, показывающая определенный столбец
function show(column) {
  commParams.removeHidingColumns(column); //Удаляет текущий столбец из списка(массива) скрытых общего объекта
  $table.querySelectorAll(`[data-cell="${column}"]`).forEach((e) => (e.hidden = false));
}

//Функция, запускающаяся при каждом рендеринге новой страницы таблицы.
//Скрывает до этого скрытые столбцы
export default function hideHiddenColumns() {
  commParams.hidingColumns && commParams.hidingColumns.forEach((e) => hide(e));
}
