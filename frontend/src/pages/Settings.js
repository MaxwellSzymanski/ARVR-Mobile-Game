import React from 'react';
import { Link } from 'react-router-dom';
import "./Settings.css"
import swal from '@sweetalert/with-react';

class Settings extends React.Component {
    constructor() {
        super();
    }

    takeNewPhoto() {
        // TODO
    }

    deleteProfile() {
        // TODO
    }

    giveFeedback() {

    }

    showQR() {
        swal({
            title: "Share the joy!",
            imageUrl: "qrCode.png"
        });
    }


    showLicences() {
        swal("Licences", "Flickity - GNU General Public License v3 \nFace-api.js - todo")
    }

    render() {
        return (
            <div>
                <div>
                    <Link to="/profilePage"> <button className="smallButton back topLeft"/></Link>
                    <h1 className="subTitle ">Settings</h1>
                </div>
                <div> <button className="normalButton fadeIn0" onClick={this.takeNewPhoto}>Take new photo</button></div>
                <div> <button className="normalButton fadeIn1" onClick={this.giveFeedback}>Give feedback</button></div>
                <div> <button className="normalButton fadeIn2" onClick={this.showQR}>Share QR code</button></div>
                <div> <button className="normalButton fadeIn3" onClick={this.showLicences}>Licences</button></div>
                <div> <button className="normalButton delete fadeIn4" onClick={this.deleteProfile}>Delete profile</button></div>
            </div>
        )
    }
}
export default Settings;
