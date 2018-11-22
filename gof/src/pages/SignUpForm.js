import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

        const dataToSend = this.state;
        dataToSend.request = "signup";

        // send HTTP request with sign up data.
        // receive success value (and error if the e-mail/username is already taken.
        const urlD = 'https://localhost:8080';
        let obj = JSON.stringify(dataToSend);

        console.log('The form was submitted with the following data:');
        console.log(this.state);

        await axios.post(urlD, obj).then(
            function (json) {
                if (json.data.success) console.log("success!\ntoken:   " + json.data.token);
                else alert(json.data.message);
            }
        );
    }



    render() {

      let button;
      if (localStorage.getItem("PhotoOfMe") === null) {
        button = <img className="button" alt="" src={ require('../camera2.png') } />;
      } else {
        var img = localStorage.getItem("PhotoOfMe")
        button = <img  className="button" alt="" src={img} />
      }

        return (
        <div className="FormCenter">
            <form onSubmit={this.handleSubmit} className="FormFields">
            <div id="text">
            <label id="text">Take a picture</label></div>


          <div id="centerButton">
          <Link to="/takePicture">
            {button}</Link></div>



              <div className="FormField">
                <label className="FormField__Label" htmlFor="name">Full Name</label>
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="name" value={this.state.name} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="FormField">
                <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                <input type="email" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>

              <div className="FormField">
                <label className="FormField__CheckboxLabel">
                    <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" value={this.state.hasAgreed} onChange={this.handleChange} /> I agree all statements in <a href='./pages/terms.html' className="FormField__TermsLink">terms of service</a>
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
export default SignUpForm;
