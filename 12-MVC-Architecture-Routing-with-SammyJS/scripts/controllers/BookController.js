class BookController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    getBookById(id) {
        let _self = this;

        this.model.getBookById(id)
            .then(getBookSuccess)
            .catch(displayError);

        function getBookSuccess(successData) {
            _self.view.viewBook(successData);
        }

        function displayError(errorData) {
            console.log(errorData);
        }
    }

    getAllBooks() {
        let _self = this; // NB !

        this.model.getAllBooks()
            .then(getAllBooksSuccess)
            .catch(displayError);

        function getAllBooksSuccess(successData) {
            _self.view.listAllBooks(successData); // NB!
        }

        function displayError(errorData) {
            console.log(errorData);
        }
    }

    createBook(data) {
        let _self = this;

        this.model.postBook(data)
            .then(postBookSuccess)
            .catch(displayError);

        function postBookSuccess(successData) {
            _self.view.viewBook(successData);
        }

        function displayError(errorData) {
            console.log(errorData);
        }
    }

    deleteBookById(id) {
        let _self = this;

        this.model.deleteBookById(id)
            .then(deleteBookSuccess)
            .catch(displayError);

        function deleteBookSuccess(successData) {
            console.log(successData);
        }

        function displayError(errorData) {
            console.log(errorData);
        }
    }
}
