import React, {Component} from 'react';

export default class DeleteBookView extends Component {
    render() {
        return (
            <form className="edit-book-form" onSubmit={this.submitForm.bind(this)}>
                <h1>Delete Book</h1>
                <label>
                    <div>Title:</div>
                    <input type="text" disabled
                           defaultValue={this.props.title} />
                </label>
                <label>
                    <div>Author:</div>
                    <input type="text" disabled
                           defaultValue={this.props.author} />
                </label>
                <label>
                    <div>Description:</div>
                    <textarea rows="10" disabled
                              defaultValue={this.props.description}>
                    </textarea>
                </label>
                <div>
                    <input type="submit" value="Delete"/>
                </div>
            </form>
        );
    }

    submitForm(event) {
        event.preventDefault();

        this.props.onsubmit(
            this.props.bookId);
    }
}