const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'Bookshelf';
const form = document.getElementById('inputBook');
const inputMencariBuku = document.getElementById('searchBookTitle');
const formMencariBuku = document.getElementById('searchBook');

inputMencariBuku.addEventListener('keyup', (e) => {
  e.preventDefault();
  cariBuku();
});

formMencariBuku.addEventListener('submit', (e) => {
  e.preventDefault();
  cariBuku();
});

// cek ketersediaan web storage pada browser
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
    year: Number(year),
    isComplete,
  };
};

// function untuk cek status buku
function cekStatusBuku() {
  const isCheckComplete = document.getElementById('inputBookIsComplete');
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

// function untuk save data ke local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// function untuk load data dari storage
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

// function untuk menampilkan data buku
function tampilkanBuku(books = []) {
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
         <p>Penulis : ${book.author}</p>
         <p>Tahun : ${book.year}</p>
 
         <div class="action">
         <button class="tombol-green" onclick="ubahStatusBuku(${book.id})"><i class="fa-solid fa-circle-check"></i></button>
         <button class="tombol-red" onclick="hapusBuku(${book.id})"><i class="fa-solid fa-trash"></i></button>
         <button class="tombol-yellow" onclick="editDataBuku(${book.id})"><i class="fa-solid fa-pen-to-square"></i></button>
         </div>
         </article>
         `;

      incompleteBookShelf.innerHTML += el;
    } else {
      let el = `
         <article class="book_item">
         <h3>${book.title}</h3>
         <p>Penulis : ${book.author}</p>
         <p>Tahun : ${book.year}</p>
 
         <div class="action">
         <button class="tombol-green" onclick="ubahStatusBuku(${book.id})"><i class="fa-solid fa-rotate-left"></i></button>
         <button class="tombol-red" onclick="hapusBuku(${book.id})"><i class="fa-solid fa-trash"></i></button>
         <button class="tombol-yellow" onclick="editDataBuku(${book.id})"><i class="fa-solid fa-pen-to-square"></i></button>
         </div>
         </article>
         `;

      completeBookShelf.innerHTML += el;
    }
  });
}

// function untuk menambahkan buku ke rak buku
function tambahkanBuku() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isComplete = cekStatusBuku();

  const id = generateId();
  const newBook = generateBookItem(
    id,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );

  books.unshift(newBook);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  swal('Success', 'New book added to shelf', 'success');
}

// menemukan index buku yang di guanakan bookId
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return null;
}

// function untuk menghapus buku
function hapusBuku(bookId) {
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
    } else {
      swal("Books don't get deleted");
    }
  });
}

// function untuk menghapus seluruh buku dari rak
function deleteAllShelf() {
  swal({
    title: 'Are You Sure?',
    text: "All books will be permanently removed from the shelf, you can't recover them!",
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      books.splice(0, books.length);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      swal(
        'Success',
        'All the books have been removed from the shelf',
        'success'
      );
    } else {
      swal('Shelf cancel emptied');
    }
  });
}

//function untuk mengubah status buku
function ubahStatusBuku(bookId) {
  const bookIndex = findBookIndex(bookId);
  for (const index in books) {
    if (index === bookIndex) {
      if (books[index].isComplete === true) {
        books[index].isComplete = false;
        swal(
          'Success',
          'Your book has been moved to the shelf unfinished',
          'success'
        );
      } else {
        books[index].isComplete = true;
        swal(
          'Success',
          'Your book has been moved to the shelf finished',
          'success'
        );
      }
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function untuk mencari buku
function cariBuku() {
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
            <p>Penulis : ${book.author}</p>
            <p>Tahun : ${book.year}</p>
 
            <div class="action">
            <button class="tombol-green" onclick="ubahStatusBuku(${book.id})">Selesai di Baca</button>
            <button class="tombol-red" onclick="hapusBuku(${book.id})">Hapus Buku</button>
            <button class="tombol-yellow" onclick="editDataBuku(${book.id})">Edit buku</button>
            </div>
            </article>
            `;

        incompleteBookShelf.innerHTML += el;
      } else {
        let el = `
            <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis : ${book.author}</p>
            <p>Tahun : ${book.year}</p>
 
            <div class="action">
            <button class="tombol-green" onclick="ubahStatusBuku(${book.id})">Belum selesai di Baca</button>
            <button class="tombol-red" onclick="hapusBuku(${book.id})">Hapus Buku</button>
            <button class="tombol-yellow" onclick="editDataBuku(${book.id})">Edit buku</button>
            </div>
            </article>
            `;

        completeBookShelf.innerHTML += el;
      }
    }
  }
}

// function untuk mengedit data buku yang ada di rak
function editDataBuku(bookId) {
  const sectionEdit = document.querySelector('.input_edit_section');
  sectionEdit.style.display = 'flex';
  const editTitle = document.getElementById('inputEditTitle');
  const editAuthor = document.getElementById('inputEditAuthor');
  const editYear = document.getElementById('inputEditYear');
  const formEditData = document.getElementById('editData');
  const cancelEdit = document.getElementById('bookEditCancel');
  const SubmitEdit = document.getElementById('bookEditSubmit');

  bookTarget = findBookIndex(bookId);

  // mengset value lama
  editTitle.setAttribute('value', books[bookTarget].title);
  editAuthor.setAttribute('value', books[bookTarget].author);
  editYear.setAttribute('value', books[bookTarget].year);

  // mengupdate data
  SubmitEdit.addEventListener('click', (e) => {
    books[bookTarget].title = editTitle.value;
    books[bookTarget].author = editAuthor.value;
    books[bookTarget].year = editYear.value;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    formEditData.deleteAll();
    sectionEdit.style.display = 'none';
    swal('Success', 'Your book data has been edited', 'success');
  });

  cancelEdit.addEventListener('click', (e) => {
    e.preventDefault();
    sectionEdit.style.display = 'none';
    formEditData.deleteAll();
    swal('You have canceled to edit the book data');
  });
}

// memuat konten dan mengsubmit form
document.addEventListener('DOMContentLoaded', function () {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tambahkanBuku();

    form.deleteAll();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Merender event addeventlistener
document.addEventListener(RENDER_EVENT, () => {
  const tomboldeleteAllShelf = document.getElementById('deleteAllShelf');
  if (books.length <= 0) {
    tomboldeleteAllShelf.style.display = 'none';
  } else {
    tomboldeleteAllShelf.style.display = 'block';
  }

  tampilkanBuku(books);
});
