import React from 'react';
import { Link } from 'react-router-dom';

class Settings extends React.Component {
    constructor() {
        super();
    }
// Flickity is used under GNU General Public License v3
    render() {
        return (
            <div>
                <Link to="/profilePage"> <button className="smallButton back"/></Link>

            </div>
        )
    }
}
export default Settings;
