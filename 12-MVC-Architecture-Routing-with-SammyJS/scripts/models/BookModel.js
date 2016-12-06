class BookModel {
    constructor(baseUrl, appKey, requester, authenticationService) {
        this._baseUrl = baseUrl;
        this._appKey = appKey;
        this._requester = requester;
        this._authenticationService = authenticationService;
    }

    getBookById(id) {
        let _requestUrl = this._baseUrl + 'appdata/' + this._appKey + '/books/' + id;
        let _requestHeaders = this._authenticationService.getHeaders();

        return this._requester.get(_requestUrl, _requestHeaders);
    }

    getAllBooks() {
        let _requestUrl = this._baseUrl + 'appdata/' + this._appKey + '/books';
        let _requestHeaders = this._authenticationService.getHeaders();

        return this._requester.get(_requestUrl, _requestHeaders);
    }

    postBook(data) {
        let _requestUrl = this._baseUrl + 'appdata/' + this._appKey + '/books';
        let _requestHeaders = this._authenticationService.getHeaders();

        return this._requester.post(_requestUrl, _requestHeaders, data);
    }

    deleteBookById(id) {
        let _requestUrl = this._baseUrl + 'appdata/' + this._appKey + '/books/' + id;
        let _requestHeaders = this._authenticationService.getHeaders();

        return this._requester.delete(_requestUrl, _requestHeaders);
    }
}