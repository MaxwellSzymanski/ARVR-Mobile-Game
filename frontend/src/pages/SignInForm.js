import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
import swal from '@sweetalert/with-react';
const cookies = new Cookies();

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
                alert(JSON.stringify(data));
                // alert("Invalid password");
            else {
                const options = {
                    path: '/',
                    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                };
                cookies.set('token', data.token, options);
                cookies.set('name', data.name, options);
                this.setState({redirect: true});
            }
        })
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
            const dataToSend = {
                email: this.state.email,
                password: this.state.password,
            };

            this.context.emit("signin", dataToSend);
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
SignInForm.contextType = SocketContext;

export default SignInForm;
