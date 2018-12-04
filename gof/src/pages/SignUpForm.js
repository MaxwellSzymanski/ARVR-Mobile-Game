import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const https = require('https');

const url = require('./serveradress.js');

// const $ = require('jQuery');

class SignUpForm extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            name: '',
            hasAgreed: false
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

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.state.hasAgreed) {
            alert("You need to agree to the terms and conditions in order to continue.")
        } else {
            const dataToSend = this.state;
            dataToSend.request = "signup";

            // const image = fs.readFileSync(PATH);
            const image = localStorage.getItem("PhotoOfMe");
            dataToSend.image = new Buffer(image).toString('base64');

            // send HTTP request with sign up data.
            let obj = JSON.stringify(dataToSend);

            console.log('The form was submitted with the following data:');
            console.log(this.state);

            // receive success value (and error if the e-mail/username is already taken.
            await axios.post(url, obj).then(
                function (json) {
                    if (json.data.success) {
                        cookies.set('loginCookie', json.data.token, {path: '/'});
                        console.log(cookies.get('loginCookie'));
                        this.setState({redirect: true});
                    }
                    else alert(json.data.message);
                }
            );
        }
    }

    openTerms() {
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
    }

    closeTerms() {
        var modal = document.getElementById('myModal');
        modal.style.display = "none";
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

        let button;
        if (localStorage.getItem("PhotoOfMe") === null) {
            button = <img className="button" alt="" src={ require('../camera2.png') } />;
        } else {
            var img = localStorage.getItem("PhotoOfMe");
            button = <img  className="imageButton" alt="" src={img} />
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
              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">User name</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your user name" name="name" value={this.state.name} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                    <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                    <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>

              <div className="FormField">
                <label className="FormField__CheckboxLabel">
                    <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" value={this.state.hasAgreed} onChange={this.handleChange} /> I agree all statements in <a className="FormField__TermsLink" onClick={this.openTerms}>terms of service</a>
                </label>
              </div>
              <div className="FormField">
                  <button className="FormField__Button mr-20">Sign Up</button> <Link to="/sign-in" className="FormField__Link">I'm already member</Link>
              </div>
            </form>

            <div id="myModal" className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <span className="close" onClick = {this.closeTerms}>&times;</span>
                        <h2>Terms and Agreements</h2>
                    </div>
                    <div className="modal-body">
                        <h3>Your Content</h3>
                        <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text,
                            images or other material you choose to display on this Website. By displaying Your Content,
                            you grant Company Name a non-exclusive, worldwide irrevocable, sub licensable license to use,
                            reproduce, adapt, publish, translate and distribute it in any and all media.

                            Your Content must be your own and must not be invading any third-party's rights.
                            Company Name reserves the right to remove any of Your Content from this Website at any time without notice.</p>


                         <h3>No warranties</h3>

                        <p>This Website is provided “as is,” with all faults, and Company Name express no representations
                            or warranties, of any kind related to this Website or the materials contained on this Website.
                            Also, nothing contained on this Website shall be interpreted as advising you.</p>

                    </div>
                </div>
            </div>
          </div>
        );
    }
}
export default SignUpForm;
