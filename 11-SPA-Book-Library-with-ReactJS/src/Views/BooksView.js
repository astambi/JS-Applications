import React, {Component} from 'react';

export default function BooksView(props) {
    let bookRows = props.books.map(book => // no this !
        <tr key={book._id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.description}</td>
            {getBookActions(book)}
        </tr>
    );

    return (
        <div className="books-view">
            <h1>Books</h1>
            <table className="books-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>{bookRows}</tbody>
            </table>
        </div>
    );

    function getBookActions(book) {
        if (book._acl.creator == sessionStorage.getItem('userId')) // edit/ delete for owners only
            return (
                <td>
                    <button onClick={props.onedit.bind(this, book._id)}>Edit</button>
                    <button onClick={props.ondelete.bind(this, book._id)}>Delete</button>
                </td>
            );
        else
            return <td></td>
    }
}