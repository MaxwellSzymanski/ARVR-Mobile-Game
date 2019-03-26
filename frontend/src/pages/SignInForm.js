import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
import swal from '@sweetalert/with-react';
import axios from 'axios';
const cookies = new Cookies();
const url = require('./serveradress.js');


class SignInForm extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            verified: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //      received object:
        // { email: false }                                 if e-mail not registered
        // { email: true, password: false }                 if e-mail registered and password incorrect
        // { email: true, password: true, token: jwt }      if e-mail registered and password correct, the jwt token
        //                                                      is further on stored in a cookie in the browser
        this.context.on("signin", function (data) {
            if (!data.email)
                swal("Invalid e-mail", {icon: "error"});
            else if (!data.password)
                swal("Invalid password", {icon: "error"});
            else {
                swal("Enjoy the game!", {icon: "success"});
                const options = {
                    path: '/',
                    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                };
                cookies.set('token', data.token, options);
                cookies.set('name', data.name, options);
                this.setState({redirect: true, verified: data.verified});
            }
        })
        if("vibrate" in window.navigator)
        {
            navigator.vibrate(2000);
        }
        else
        {
            console.log("Your browser doesn't support vibration API");
        }
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

        const that = this;

        if (!this.state.email || !this.state.password) {
            alert("Please fill in all fields.")
        } else {
            const dataToSend = {
                request: "signin",
                email: this.state.email,
                password: this.state.password,
            };

            // this.context.emit("signin", JSON.stringify(dataToSend));

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
                        swal("Invalid e-mail", {icon: "error"});
                    else if (!json.data.password)
                        swal("Invalid password", {icon: "error"});
                    else {
                        if (json.data.verified) swal("Enjoy the game!", {icon: "success"});
                        else swal("You still need to verify your e-mail.", {icon: "warning"});
                        const options = {
                            path: '/',
                            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                        };
                        cookies.set('token', json.data.token, options);
                        cookies.set('name', json.data.name, options);
                        that.setState({redirect: true, verified: json.data.verified});
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
        if (this.state.redirect) {
            if (this.state.verified) {
                window.location.reload();
            } else {
                return <Redirect to="/verify"/>
            }
        }
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
SignInForm.contextType = SocketContext;

export default SignInForm;
