import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const url = require('./serveradress.js');

class SignInForm extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        let that = this;

        if (!this.state.email || !this.state.password) {
            alert("Please fill in all fields.")
        } else {
            const position = {longitude: 0.0, latitude: 0.0};

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(storePosition);
            } else {
                alert("No geolocation available");
            }

            function storePosition(pos) {
                position.longitude = pos.coords.longitude;
                position.latitude = pos.coords.latitude;
            }

            this.state.position = position;
            const dataToSend = this.state;
            dataToSend.request = "signin";

            console.log('The form was submitted to ' + url + ' with the following data:');
            console.log(this.state);

            let obj = JSON.stringify(dataToSend);
            // send HTTP request with login data and receive value about correctness of data.
            //      received object:
            // { email: false }                                 if e-mail not registered
            // { email: true, password: false }                 if e-mail registered and password incorrect
            // { email: true, password: true, token: jwt }      if e-mail registered and password correct, the jwt token
            //                                                      is further on stored in a cookie in the browser
            await axios.post(url, obj).then(
                function (json) {
                    if (!json.data.email)
                        alert("invalid e-mail");
                    else if (!json.data.password)
                        alert("invalid password");
                    else {
                        const cookie = {
                            token: json.data.token,
                            name: json.data.name
                        };
                        cookies.set('loginCookie', cookie, {path: '/'});
                        console.log(cookies.get('loginCookie'));
                        that.setState({redirect: true});
                    }
                }
            );
        }
    }

    state = {
        redirect : false };

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/map" />}
    };

    goToMap() {
        this.setRedirect();
    };

    render() {
        return (
            <div className="FormCenter">
                {this.renderRedirect()}
                {/* eslint-disable-next-line*/}
                <form onSubmit={this.handleSubmit} className="FormFields">
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                        <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    <div className="FormField">
                        <button className="FormField__Button mr-20">Sign In</button> <Link to="/" className="FormField__Link">Create an account</Link>
                    </div>
                </form>


            </div>
        );
    }
}

export default SignInForm;
