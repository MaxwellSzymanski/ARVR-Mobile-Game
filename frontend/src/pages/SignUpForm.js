import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import swal from '@sweetalert/with-react';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
import axios from 'axios';
const Filter = require('bad-words');
const filter = new Filter();
const cookies = new Cookies();
const url = require('./serveradress.js');


class SignUpForm extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            name: '',
            hasAgreed: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fileSelectorHandler = event => {
        console.log(event);
    };

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });

    }

    componentDidMount() {
        this.context.on('signup', (data) => {
            if (data.success) {
                swal("Account created! Now please verify your e-mail in the next step.", {icon: "success"});
                const options = {
                    path: '/',
                    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                };
                cookies.set('token', data.token, options);
                cookies.set('name', data.name, options);
                this.setState({redirect: true});
            }
            else swal(data.message, {icon: "warning"});
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const that = this;

        const image = localStorage.getItem("PhotoOfMe");
		const featureVector = localStorage.getItem("fv");

		if (!image) {
		    swal("Please take a picture first.", {icon: 'warning'})
        } else if (!this.state.name || !this.state.email || !this.state.password) {
            swal("Please fill in all fields.", {icon: 'warning'});
        } else if (!this.state.hasAgreed) {
            swal("You need to agree to the terms and conditions in order to continue.", {icon: 'warning'})
        } else if (filter.isProfane(this.state.name)) {
            swal({title: "Watch that mouth!", text: "We do not tolerate such usernames in this game. Please pick another.", icon: "error"});
        } else {
            const dataToSend = {
                request: "signup",
                email: this.state.email,
                name: this.state.name,
                password: this.state.password,
                token: cookies.get("fieldtest")
            };

            dataToSend.image = image.toString('base64');
            dataToSend.featureVector = featureVector;

            // this.context.emit('signup', JSON.stringify(dataToSend));

            const obj = JSON.stringify(dataToSend);

            await axios.post(url, obj).then(
                function (json) {
                    if (json.data.success) {
                        swal("Account created! Now please verify your e-mail in the next step.", {icon: "success"});
                        const options = {
                            path: '/',
                            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                        };
                        cookies.set('token', json.data.token, options);
                        cookies.set('name', json.data.name, options);
                        localStorage.removeItem("PhotoOfMe");
                        that.setState({redirect: true});
                    }
                    else swal(json.data.message, {icon: "warning"});
                }
            );

        }
    }

    showTerms() {
        swal("Terms and services", "By clicking accept, you agree that your " +
            "picture, username and password will be stored securely on our server. " +
            "You also agree that other player may take pictures of you while interacting " +
            "with the game, and your username will be displayed publicly.", {
            button: "Okay"})
    }

    state = {
        redirect : false };

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/verify" />}
    };

    goToMap() {
        this.setRedirect();
    };

    render() {

        let button;
        if (localStorage.getItem("PhotoOfMe") === null) {
            button = <img  className="bigButton camera" />;
        } else {
            var img = localStorage.getItem("PhotoOfMe");
            button = <img  className="imageButton" alt="" src={img} />;
        }

        return (

        <div className="FormCenter">
        {this.renderRedirect()}
            <form onSubmit={this.handleSubmit} className="FormFields">
            <div id="text">
            <label id="text">Take a picture</label></div>

          <div id="centerButton">
          <Link to="/takePicture">
            {button}</Link></div>
              <div className="FormField fadeIn1">
                <label className="FormField__Label" htmlFor="name">User name</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your user name (max. 16 characters)" name="name" value={this.state.name} onChange={this.handleChange} maxLength="16"/>
              </div>
              <div className="FormField fadeIn2">
                    <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                    <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div className="FormField fadeIn3">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>

              <div className="FormField">
                <label className="FormField__CheckboxLabel">
                    <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" value={this.state.hasAgreed} onChange={this.handleChange} /> I agree to all statements in the <a className="FormField__TermsLink" onClick={this.showTerms}>terms of service</a>
                </label>
              </div>
              <div className="FormField">
                  <button className="FormField__Button mr-20">Sign Up</button> <Link to="/sign-in" className="FormField__Link">I'm already member</Link>
              </div>
            </form>
          </div>
        );
    }
}
SignUpForm.contextType = SocketContext;

export default SignUpForm;
