document.addEventListener('DOMContentLoaded', function () {
  const books = [];
  const RENDER_EVENT = 'render-book';
  const SAVED_EVENT = 'saved-book';
  const STORAGE_KEY = 'BOOKSHELF_APPS';

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      year: parseInt(year),
      author,
      isCompleted,
    };
  }

  function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      title,
      author,
      year,
      false
    );
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveData();
  }

  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function addBookToReadBookShelf(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
});
