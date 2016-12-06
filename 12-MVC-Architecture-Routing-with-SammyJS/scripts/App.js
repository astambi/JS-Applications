sessionStorage.setItem('authtoken', btoa('guest:guest'));

(function () {
    // Routing with Sammy
    let router = Sammy(function () {
        const baseUrl = 'https://baas.kinvey.com/';
        const appKey = 'kid_rJYKcT_Gx';
        const appSecret = '155a0eb1f98a4c02a5e3d4fe081a1049';

        let requester = new Requester();
        let authenticationService = new AuthenticationService(appKey, appSecret);

        let bookView = new BookView();
        let bookModel = new BookModel(baseUrl, appKey, requester, authenticationService);
        let bookController = new BookController(bookModel, bookView);

        // Sammy
        this.get('#/home', function () {
            $('#app').append(
                $('<button>').text('List All Books'),
                $('<button>').text('Book Id#'),
                $('<button>').text('Create Book')
            );
        }); // does not work !!!

        this.get('#/books', function () {
            bookController.getAllBooks();
        });
        // this.get('#/books/:id', function () {
        //     bookController.getBookById(id);
        // });
        // this.get('#/create', function () {
        //     bookController.createBook();
        // });
        // this.get('#/delete/:id', function () {
        //     bookController.deleteBookById(id);
        // });
    });

    // Sammy
    router.run('#/books');

})();