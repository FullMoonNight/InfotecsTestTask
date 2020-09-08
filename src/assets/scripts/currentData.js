import sort from "@scripts/sortData";
import data from "@assets/data";
import commonParams from "@scripts/commonParams";

const $thead = document.querySelector(".table-head");
//Функция находит текущую часть данных из целого массива на основе текущей страницы и количестве элементов на странице
export function loadLocalData() {
  let partOfData = data.slice((commonParams.currentPage - 1) * commonParams.elemOnPage, commonParams.currentPage * commonParams.elemOnPage);
  return partOfData.map((elem) => JSON.parse(localStorage.getItem(`${elem.id}`)) || elem); //Если элемент с таким id изменен, значит получить его новые значения из лоального хранилища
}
//Функция возвращает текущую часть данных, и если какой то столбец отсортирован,
//тогда возвращает эту часть данных отсортированной в соответствии со столбцом
export default function getCurrentData() {
  let activeSortTitle = $thead.querySelector('[data-sorted="true"]');
  let colNum;
  activeSortTitle && (colNum = +activeSortTitle.dataset.cell); //Если есть отсортированный столбец, тогда получить его номер
  let partOfData = loadLocalData();
  if (!colNum) return partOfData; //Если нет отсортированого столбца, тогда возвращать просто часть данных
  let mode = activeSortTitle.dataset.mode;

  //Так как функция Array.prototype.sort() принимает функцию с двумя параметрами(сравниваемые элементы),
  //то пришлось привязать номер столбца и режим сортировки через bind
  let s = sort.bind(null, colNum, mode);

  return partOfData.sort(s); //Возврат отсортированной части данных
}
