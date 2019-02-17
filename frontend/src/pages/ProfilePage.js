import React from 'react';
import { Link } from 'react-router-dom';
import "./profilePage.css"

class ProfilePage extends React.Component {
    constructor() {
        super();
    }


    render() {
        return (
            <div>

                {/* Buttons and profile */}

                <button className="smallButton back topLeft"/>;
                <div className="profileCard">
                    <div className="profilePhoto"></div>
                    <h1 className="name">Marie Nathalie</h1>
                    <h3 className="smallText">Level 13</h3>
                    <div className="xpBar">
                        <div className="xpGained"></div>
                    </div>
                    <h3 className="smallText">200<b>/350 xp</b></h3>
                </div>

                <button className="smallButton settings topRight"/>

                {/* Stat card */}

                <div className="statCard">
                    <div className="statContainer">
                        <h3 className="statTitle">Kills</h3>
                        <h3 className="statNumber">8</h3>
                        <div className="divider"></div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Deaths</h3>
                        <h3 className="statNumber">2</h3>
                        <div className="divider"></div>
                    </div>
                    <div className="statContainer">
                        <h3 className="statTitle">Items</h3>
                        <h3 className="statNumber">13</h3>
                    </div>
                </div>

                {/* Info card */}

                <div className="contentCard">
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Health</h3>

                        <div className="attributeValueContainer">
                            <p className="attributeNumber">8</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Attack</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">4</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Defence</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">8</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Visibility</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">12</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ProfilePage;
