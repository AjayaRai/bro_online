import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Redux stuff
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

class signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            userName: '',
            namee: '',
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            userName: this.state.userName,
            namee: this.state.namee
        };

        this.props.signupUser(newUserData, this.props.history);
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {

        return (
            <div>
                <h1>Sign Up Page</h1>

                <form onSubmit={this.handleSubmit}>
                    Name<br/>
                    <input id={`namee`} name={`namee`} type={`text`} value={this.state.namee} onChange={this.handleChange}/><br/>
                    User Name<br/>
                    <input id={`userName`} name={`userName`} type={`text`} value={this.state.userName} onChange={this.handleChange}/><br/>
                    Email<br/>
                    <input id={`email`} name={`email`} type={`text`} value={this.state.email} onChange={this.handleChange}/><br/>
                    Password<br/>
                    <input id={`password`} name={`password`} type={`text`} value={this.state.password} onChange={this.handleChange}/><br/>

                    <input type={`submit`} value={`Sign Up`}/><br/>
                    Already registered <Link to={`/login`}>click here</Link> to login
                </form>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(
    mapStateToProps,
    { signupUser }
)(signup);