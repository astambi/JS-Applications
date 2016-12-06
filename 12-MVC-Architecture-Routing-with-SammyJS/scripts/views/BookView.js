class BookView {
    constructor(data) {

    }

    viewBook(book) {
        $('<div>').addClass('book book-details')
            .append(
                $('<div>').text(book.title).addClass('book-title'),
                $('<div>').text(book.author),
                $('<div>').text(book.description)
            )
            .appendTo($('#app'));
    }

    listAllBooks(books) {
        books.forEach(function (entity) {
            $('<div>').addClass('book')
                .append(
                    $('<div>').text(entity.title).addClass('book-title'),
                    $('<div>').text(entity.author),
                    $('<div>').text(entity.description)
                )
                .appendTo($('#app'));
        })
    }
}