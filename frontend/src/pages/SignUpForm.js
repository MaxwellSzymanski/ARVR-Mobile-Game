import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
const cookies = new Cookies();

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
                const options = {
                    path: '/',
                    expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)   // expires in 24 hours
                };
                cookies.set('token', data.token, options);
                cookies.set('name', data.name, options);
                this.setState({redirect: true});
            }
            else alert(data.message);
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        const image = localStorage.getItem("PhotoOfMe");
		const featureVector = localStorage.getItem("fv");

		if (!image) {
		    alert("Please take a picture first.")
        } else if (!this.state.name || !this.state.email || !this.state.password) {
            alert("Please fill in all fields.");
        } else if (!this.state.hasAgreed) {
            alert("You need to agree to the terms and conditions in order to continue.")
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

            const dataToSend = {
                email: this.state.email,
                name: this.state.name,
                password: this.state.password,
                position: position,
            };

            dataToSend.image = new Buffer(image).toString('base64');
            dataToSend.featureVector = featureVector;

            this.context.emit('signup', dataToSend);
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
        if (this.state.redirect) {return <Redirect to="/verify" />}
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
                <input type="text" id="name" className="FormField__Input" placeholder="Enter your user name (max. 16 characters)" name="name" value={this.state.name} onChange={this.handleChange} maxlength="16"/>
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
                        <p>By 'your Content', any pictures and usernames you use are meant. By registering, you agree
                        to having your content used within the website, modified, and deleted without warning.</p>


                         <h3>No warranties</h3>

                        <p>This Website is provided “as is,” with all faults, and GOW expresses no representations
                            or warranties, of any kind related to this website or the materials contained on this website.
                            </p>

                    </div>
                </div>
            </div>
          </div>
        );
    }
}
SignUpForm.contextType = SocketContext;

export default SignUpForm;
