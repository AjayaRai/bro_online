import React, {Component} from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

class login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.loginUser(userData, this.props.history);
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        return (
            <div>
                <h1>Login Page</h1>

                <form onSubmit={this.handleSubmit}>
                    <input id={`email`} name={`email`} type={`text`} value={this.state.email} onChange={this.handleChange}/>
                    <input id={`password`} name={`password`} type={`text`} value={this.state.password} onChange={this.handleChange}/>

                    <input type={`submit`} value={`Login`}/>
                </form>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(login);