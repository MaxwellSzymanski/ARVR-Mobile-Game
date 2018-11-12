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

        const dataToSend = this.state;
        dataToSend.request = "signin";

        // send HTTP request to get JSON object with players
        var urlD = 'http://localhost:8080';
        let obj = JSON.stringify(dataToSend);

        console.log('The form was submitted with the following data:');
        console.log(this.state);

        await axios.post(urlD, obj).then(
            function(json) {
                console.log('got here');
                console.log(json.data.result);
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
