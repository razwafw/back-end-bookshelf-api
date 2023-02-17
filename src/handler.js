const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const nameExists = request.payload.hasOwnProperty('name');
  const validPage = request.payload['readPage'] <= request.payload['pageCount'];

  if (!nameExists) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (!validPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
        'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getBooksHandler = (request, h) => {
  const {name: qName, reading, finished} = request.query;

  let datas = books;

  if (qName) {
    datas = datas.filter((x) =>
      x.name.toLowerCase().includes(qName.toLowerCase()));
  }

  if (reading) {
    datas = datas.filter((x) => x.reading == Boolean(Number(reading)));
  }

  if (finished) {
    datas = datas.filter((x) => x.finished == Boolean(Number(finished)));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: datas.map(({id, name, publisher}) => ({id, name, publisher})),
    },
  });

  response.code(200);
  return response;
};

const getBookDetailsHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        'book': book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editBookDetailsHandler = (request, h) => {
  const nameExists = request.payload.hasOwnProperty('name');
  const validPage = request.payload['readPage'] <= request.payload['pageCount'];

  if (!nameExists) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (!validPage) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const {bookId} = request.params;

  const selectedBookIndex = books.findIndex((book) => book.id === bookId);

  if (selectedBookIndex !== -1) {
    books[selectedBookIndex] = {
      ...books[selectedBookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const removeBookHandler = (request, h) => {
  const {bookId} = request.params;

  const selectedBookIndex = books.findIndex((book) => book.id === bookId);

  if (selectedBookIndex !== -1) {
    books.splice(selectedBookIndex, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookDetailsHandler,
  editBookDetailsHandler,
  removeBookHandler,
};
