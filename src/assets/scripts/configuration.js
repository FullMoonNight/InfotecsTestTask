let conf = {
  _currentPage: 1,
  _elemOnPage: +localStorage.getItem("elemOnPage") || 10,

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
};

export default conf;
