import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import "./Settings.css"
import swal from '@sweetalert/with-react';
import SweetAlert from 'sweetalert2-react';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
const cookies = new Cookies();

class Settings extends React.Component {
    constructor() {
        super();

        this.state = {
          redirect: false,
          show: false
        };

        this.deleteProfile = this.deleteProfile.bind(this);
        this.takeNewPhoto = this.takeNewPhoto.bind(this);
    }

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
      if (this.state.redirect) {return <Redirect to="/changePicture" />}
    };

    componentDidMount() {
        this.context.on("deleteaccount", (data) => {
            if (data.success) {
                swal({title: "Account deleted!", text: "Thanks for playing.", icon: "success"});
                cookies.remove("token");
                cookies.remove("name");
                cookies.remove("fieldtest");
                window.location.reload();
            } else {
                swal({title: "Something went wrong.", text: "Please try again.", icon: "error"});
            }
        });
        this.context.on("message", (data) => {
            swal({text: data.message});
        });

        this.interval = setInterval(() => {
            this.sendLocation();
        }, 750);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    sendLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.context.emit("location", {
                token: cookies.get('token'),
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
                accuracy: Math.round(position.coords.accuracy)
            })
        });
    }

    takeNewPhoto() {
      this.setRedirect();
      console.log("hey")
    }

    deleteProfile() {
        swal({
            title: "Are you sure?",
            text: "By deleting this account, you lose all progress in the game.\nThis action is irreversible.",
            icon: "warning",
            dangerMode: true,
            buttons: true,
        }).then( (value) => {
            if (value) {
                this.context.emit("deleteaccount", {token: cookies.get("token")});
            } else {
                swal({ title: "Thank you for staying!", button: "My pleasure!" });
            }
        });
    }

    giveFeedback() {
        window.open("https://goo.gl/forms/4VRZHjURLrIEPplD2", "_blank");
    }

    showQR() {
        swal({
            title: "Share the joy!",
            imageUrl: "./qrCode.png"
        });
    }

    resetTutorials() {
        swal({title: "Tutorials reset!", text: "The tutorials will be displayed again. You can always dismiss them when you think you know what to do.", icon: "success"})
        this.context.emit("resetTutorial", {token: cookies.get('token')})
    }


    showLicences() {
        swal("Licences", "Flickity - GNU General Public License v3 \nFace-api.js - MIT Licence", "Icons used: 'https://icons8.com/license'")
    }

    render() {
        return (
            <div>
            {this.renderRedirect()}
                <div>
                    <Link to="/map"> <button className="smallButton back topLeft fadeIn0"/></Link>
                    <h1 className="subTitle fadeIn0">Settings</h1>
                </div>
                <div> <button className="normalButton fadeIn0" onClick={this.takeNewPhoto}>Take new photo</button></div>
                <div> <button className="normalButton fadeIn1" onClick={this.giveFeedback}>Give feedback</button></div>
                <Link to="/QRCode"><div> <button className="normalButton fadeIn2">Share QR code</button></div></Link>
                <div> <button className="normalButton fadeIn3" onClick={this.showLicences}>Licences</button></div>
                <div> <button className="normalButton fadeIn4" onClick={this.resetTutorials}>Reset tutorials</button></div>
                <div> <button className="normalButton delete fadeIn5" onClick={this.deleteProfile}>Delete profile</button></div>
            </div>
        )
    }
}
Settings.contextType = SocketContext;

export default Settings;
