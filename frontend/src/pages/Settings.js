import React from 'react';
import { Link } from 'react-router-dom';
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
            show: false
        };

        this.deleteProfile = this.deleteProfile.bind(this);
    }

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
    }

    takeNewPhoto() {
        // TODO
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


    showLicences() {
        swal("Licences", "Flickity - GNU General Public License v3 \nFace-api.js - todo", "Icons used: 'https://icons8.com/license'")
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/profilePage"> <button className="smallButton back topLeft fadeIn0"/></Link>
                    <h1 className="subTitle fadeIn0">Settings</h1>
                </div>
                <div> <button className="normalButton fadeIn0" onClick={this.takeNewPhoto}>Take new photo</button></div>
                <div> <button className="normalButton fadeIn1" onClick={this.giveFeedback}>Give feedback</button></div>
                <Link to="/QRCode"><div> <button className="normalButton fadeIn2">Share QR code</button></div></Link>
                <div> <button className="normalButton fadeIn3" onClick={this.showLicences}>Licences</button></div>
                <div> <button className="normalButton delete fadeIn4" onClick={this.deleteProfile}>Delete profile</button></div>
            </div>
        )
    }
}
Settings.contextType = SocketContext;

export default Settings;
