import React, {Component} from "react";
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from "axios";

// Redux
import {Provider} from 'react-redux';
import store from './redux/store';

// Components
import AuthRoute from './util/AuthRoute';

// Pages
import group from "./pages/group";
import login from "./pages/login";
import home from "./pages/home";
import signup from "./pages/signup";
import search from "./pages/search";

// Redux
import {SET_AUTHENTICATED} from "./redux/types";
import { logoutUser, getUserData } from './redux/actions/userActions';


const token = localStorage.FBIdToken;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
        window.location.href = '/login';
    } else {
        store.dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common['Authorization'] = token;
        store.dispatch(getUserData());
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path={`/group/:docId`} component={group}/>
                        <Route exact path={`/`} component={home}/>
                        <Route exact path={`/group/:docId/search`} component={search}/>
                        <Route exact path={`/search`} component={search}/>
                        <AuthRoute exact path={`/login`} component={login} />
                        <AuthRoute exact path="/signup" component={signup} />
                    </Switch>
                </Router>
            </Provider>
        )
    };
}

export default App;
