import React from 'react';
import { Link } from 'react-router-dom';
import "./QRCode.css"
import swal from '@sweetalert/with-react';
import SweetAlert from 'sweetalert2-react';
import io from "socket.io-client";

class Settings extends React.Component {
    constructor() {
        super();

        this.state = {
            show: false
        };
    }

    render() {
        return (
            <div>
                <h1 className="subTitle fadeIn0"> Share the joy! </h1>
                <div className="qrCode fadeIn1"> </div>
                <div>
                    <Link to="/settings"><button className="normalButton fadeIn2">Go back</button></Link>
                </div>

            </div>
        )
    }
}
export default Settings;
