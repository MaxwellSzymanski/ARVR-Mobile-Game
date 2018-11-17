import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

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

        const position = { longitude: 0.0, latitude: 0.0 };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(storePosition);
        } else {
            alert("No geolocation available");
        }

        function storePosition(pos) {
            position.longitude = pos.coords.longitude;
            position.latitude = pos.coords.latitude;
        };

        this.state.position = position;
        const dataToSend = this.state;
        dataToSend.request = "signin";

        // send HTTP request with login data and receive value
        // about correctness of data.
        const urlD = 'https://localhost:8080';
        let obj = JSON.stringify(dataToSend);

        console.log('The form was submitted with the following data:');
        console.log(this.state);

        // received object:
        // { email: false }                             if e-mail not registered
        // { email: true, password: true/false }        if e-mail registered and password correct/incorrect
        await axios.post(urlD, obj).then(
            function(json) {
                if (!json.data.email) console.log("invalid e-mail");
                else if(!json.data.password) console.log("invalid password");
                else console.log("success!");
            }
        );
    }

    render() {
        return (
        <div className="FormCenter">
            {/* eslint-disable-next-line*/}
            <form onSubmit={this.handleSubmit} className="FormFields" onSubmit={this.handleSubmit}>
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
