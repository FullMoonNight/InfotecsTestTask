let commonParams = {
  _currentPage: 1,
  _elemOnPage: +localStorage.getItem("elemOnPage") || 10,
  _hidingColumns: [],
  get elemOnPage() {
    return this._elemOnPage;
  },
  set currentPage(val) {
    this._currentPage = val;
  },
  get currentPage() {
    return this._currentPage;
  },
  updateElemOnPage() {
    this._elemOnPage = +localStorage.getItem("elemOnPage") || 10;
  },
  addHidingColumns(col) {
    !this._hidingColumns.includes(col) && this._hidingColumns.push(col);
  },
  removeHidingColumns(col) {
    let i = this._hidingColumns.findIndex((elem) => elem === col);
    i !== -1 && this._hidingColumns.splice(i, 1);
  },
  get hidingColumns() {
    return this._hidingColumns;
  },
};

export default commonParams;
