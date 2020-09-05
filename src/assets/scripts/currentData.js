import sort from "@scripts/sortData";
import data from "@assets/data";
import commonParams from "@scripts/commonParams";

const $thead = document.querySelector(".table-head");

export function loadLocalData() {
  let partOfData = data.slice((commonParams.currentPage - 1) * commonParams.elemOnPage, commonParams.currentPage * commonParams.elemOnPage);
  return partOfData.map((elem) => JSON.parse(localStorage.getItem(`${elem.id}`)) || elem);
}

export default function getCurrentData() {
  let activeSortTitle = $thead.querySelector('[data-sorted="true"]');
  let colNum;
  activeSortTitle && (colNum = +activeSortTitle.dataset.cell);
  let partOfData = loadLocalData();
  if (!colNum) return partOfData;
  let mode = activeSortTitle.dataset.mode;
  let s = sort.bind(null, colNum, mode);

  return partOfData.sort(s);
}
