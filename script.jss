document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const searchInput = document.getElementById('search');
    
    let books = JSON.parse(localStorage.getItem('books')) || [];
    
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    function renderBooks(filteredBooks = books) {
        bookList.innerHTML = '';
        filteredBooks.forEach((book, index) => {
            const li = document.createElement('li');
            li.className = book.borrowed ? 'borrowed' : '';
            li.innerHTML = `
                <div>
                    <strong>${book.title}</strong> by ${book.author} (ISBN: ${book.isbn})
                    <span>${book.borrowed ? ' - Borrowed' : ' - Available'}</span>
                </div>
                <div>
                    <button class="borrow" data-index="${index}">${book.borrowed ? 'Return' : 'Borrow'}</button>
                    <button class="delete" data-index="${index}">Delete</button>
                </div>
            `;
            bookList.appendChild(li);
        });
    }
    
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        
        books.push({ title, author, isbn, borrowed: false });
        saveBooks();
        renderBooks();
        bookForm.reset();
    });
    
    bookList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('delete')) {
            books.splice(index, 1);
            saveBooks();
            renderBooks();
        } else if (e.target.classList.contains('borrow')) {
            books[index].borrowed = !books[index].borrowed;
            saveBooks();
            renderBooks();
        }
    });
    
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        renderBooks(filtered);
    });
    
    renderBooks();
});
