const books = [];
const RENDER_EVENT = 'RENDER_EVENT';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const form = document.getElementById('inputBook');
const searchBookInput = document.getElementById('searchBookTitle');
const searchBookForm = document.getElementById('searchBook');

searchBookInput.addEventListener('keyup', (e) => {
  e.preventDefault();
  searchBook();
});

searchBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchBook();
});

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    swal(
      'Sorry, This browser does not support web storage yet. please use another Browser',
      'info'
    );
    return false;
  }
  return true;
}

const generateId = () => +new Date();

const generateBookItem = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
};

function checkBookStatus() {
  const isCheckComplete = document.getElementById('inputBookIsComplete');
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    data.forEach((book) => {
      books.unshift(book);
    });
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  return books;
}

function bookList(books = []) {
  const incompleteBookShelf = document.getElementById(
    'incompleteBookshelfList'
  );
  const completeBookShelf = document.getElementById('completeBookshelfList');

  incompleteBookShelf.innerHTML = '';
  completeBookShelf.innerHTML = '';

  books.forEach((book) => {
    if (book.isComplete == false) {
      let el = `
         <article class="book_item">
         <h3>${book.title}</h3>
         <p>Author : ${book.author}</p>
         <p>Year : ${book.year}</p>

         <div class="action">
         <button class="green" onclick="toggleBookStatus(${book.id})">Read</button>
         <button class="blue" onclick="editBook(${book.id})">Edit</button>
         <button class="red" onclick="deleteBook(${book.id})">Delete</button>
         </div>
         </article>
         `;

      incompleteBookShelf.innerHTML += el;
    } else {
      let el = `
         <article class="book_item">
         <h3>${book.title}</h3>
         <p>Author : ${book.author}</p>
         <p>Year : ${book.year}</p>

         <div class="action">
         <button class="green" onclick="toggleBookStatus(${book.id})">Unread</button>
         <button class="blue" onclick="editBook(${book.id})">Edit</button>
         <button class="red" onclick="deleteBook(${book.id})">Delete</button>
         </article>
         `;

      completeBookShelf.innerHTML += el;
    }
  });
}

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = checkBookStatus();

  const id = generateId();
  const newBook = generateBookItem(id, title, author, year, isComplete);

  books.unshift(newBook);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  swal('Success', 'Successfully added book to the shelf', 'success');
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return null;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  swal({
    title: 'Are You Sure?',
    text: "The book will be permanently deleted, you can't recover it!",
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      swal('Success', 'The book has been removed from the shelf', 'success');
    }
  });
}

function toggleBookStatus(bookId) {
  const bookIndex = findBookIndex(bookId);
  for (const index in books) {
    if (index === bookIndex) {
      if (books[index].isComplete === true) {
        books[index].isComplete = false;
        swal(
          'Success',
          'Your book has been moved to the unread shelf',
          'success'
        );
      } else {
        books[index].isComplete = true;
        swal(
          'Success',
          'Your book has been moved to the read shelf',
          'success'
        );
      }
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const inputSearchValue = document
    .getElementById('searchBookTitle')
    .value.toLowerCase();
  const incompleteBookShelf = document.getElementById(
    'incompleteBookshelfList'
  );
  const completeBookShelf = document.getElementById('completeBookshelfList');
  incompleteBookShelf.innerHTML = '';
  completeBookShelf.innerHTML = '';

  if (inputSearchValue == '') {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  }

  for (const book of books) {
    if (book.title.toLowerCase().includes(inputSearchValue)) {
      if (book.isComplete == false) {
        let el = `
         <article class="book_item">
         <h3>${book.title}</h3>
         <p>Author : ${book.author}</p>
         <p>Year : ${book.year}</p>

         <div class="action">
         <button class="green" onclick="toggleBookStatus(${book.id})">Read</button>
         <button class="blue" onclick="editBook(${book.id})">Edit</button>
         <button class="red" onclick="deleteBook(${book.id})">Delete</button>
         </div>
         </article>
         `;

        incompleteBookShelf.innerHTML += el;
      } else {
        let el = `
         <article class="book_item">
         <h3>${book.title}</h3>
         <p>Author : ${book.author}</p>
         <p>Year : ${book.year}</p>

         <div class="action">
         <button class="green" onclick="toggleBookStatus(${book.id})">Unread</button>
         <button class="blue" onclick="editBook(${book.id})">Edit</button>
         <button class="red" onclick="deleteBook(${book.id})">Delete</button>
         </article>
         `;

        completeBookShelf.innerHTML += el;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();

    form.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  bookList(books);
});

const modal = document.getElementById('editBookModal');

const span = document.getElementsByClassName('close')[0];

function editBook(bookId) {
  modal.style.display = 'block';

  const bookIndex = findBookIndex(bookId);
  const book = books[bookIndex];

  document.getElementById('editBookId').value = book.id;
  document.getElementById('editBookTitle').value = book.title;
  document.getElementById('editBookAuthor').value = book.author;
  document.getElementById('editBookYear').value = book.year;
  document.getElementById('editBookIsComplete').checked = book.isComplete;
}

span.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

document
  .getElementById('editBookForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    const bookId = document.getElementById('editBookId').value;
    const title = document.getElementById('editBookTitle').value;
    const author = document.getElementById('editBookAuthor').value;
    const year = document.getElementById('editBookYear').value;
    const isComplete = document.getElementById('editBookIsComplete').checked;

    updateBook(bookId, title, author, year, isComplete);

    modal.style.display = 'none';
  });

  function updateBook(bookId, title, author, year, isComplete) {
    const bookIndex = findBookIndex(bookId);

    if (bookIndex !== -1) {
      books[bookIndex].title = title;
      books[bookIndex].author = author;
      books[bookIndex].year = parseInt(year, 10);
      books[bookIndex].isComplete = isComplete;

      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));

      swal('Success', 'Book has been updated', 'success');
    } else {
      swal('Error', 'Book not found', 'error');
    }
  }
