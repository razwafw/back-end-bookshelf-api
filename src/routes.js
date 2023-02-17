const {
  addBookHandler,
  getBooksHandler,
  getBookDetailsHandler,
  editBookDetailsHandler,
  removeBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookDetailsHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookDetailsHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: removeBookHandler,
  },
];

module.exports = routes;
