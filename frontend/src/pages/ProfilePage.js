import React from 'react';
import { Link } from 'react-router-dom';
import "./profilePage.css"
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class ProfilePage extends React.Component {
    constructor() {
        super();

        this.state = {
            name: cookies.get('name'),
            health: 100,
            attack: 100,
            defence: 100,
            level: 1,
            visibility: 0,
            experience: 0,
            encodedPic: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAyMjQgMjI0IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNHYtMjI0aDIyNHYyMjR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iIzc1MGMwNCI+PHBhdGggZD0iTTE4OC4xMzM3NSw0LjQ3MTI1Yy0wLjgwNjQsMC4wMDU2IC0xLjYwNjg1LDAuMjM0NSAtMi4zMDEyNSwwLjY4MjVjLTAuNDQ4LDAuMjY4OCAtMi41NTYwNSwxLjU2NjI1IC01Ljg3MTI1LDMuODA2MjVjMCwwIC0wLjIyNTc1LDAuMTc3NDUgLTAuNjczNzUsMC40NDYyNWMtNi4wMDMyLDQuNDggLTUwLjI2MzUsMzguMTI2NTUgLTYyLjgwNzUsNzUuNzEzNzVsMjIuNCwtNC40OGMwLDAgLTQxLjg4NjYsMzcuNjczNjUgLTU2LjgwNSwxMDAuOTMxMjVjMCwtMC4wNDQ4IC0xLjk5NSw4LjgzMDE1IC0yLjU1NSwxNC43NDM3NWMwLjc2MTYsMS43NDcyIDEuNTIzMiwzLjUzNDY1IDIuMjQsNS40MTYyNWMwLjA0NDgsMC4xMzQ0IDIuNTA0Niw2LjcxODk1IDMuNTM1LDEwLjEyMzc1YzAuNTgyNCwxLjg4MTYgMi4zMzM4LDMuMTg1IDQuMzA1LDMuMTg1aDQ0LjhjMS45NzEyLDAgMy43MjI2LC0xLjMwMzQgNC4zMDUsLTMuMTg1YzE2Ljg0NDgsLTU0Ljc5MDQgNTMuNDAwNTUsLTYzLjc4ODkgNTQuOTIzNzUsLTY0LjEwMjVjMS4zODg4LC0wLjMxMzYgMi41NTAxLC0xLjI5ODUgMy4xMzI1LC0yLjY0MjVsMTMuNDQsLTMxLjM2YzAuNjI3MiwtMS40MzM2IDAuNDUwOCwtMy4wOTQzNSAtMC40OSwtNC4zNDg3NWwtMjEuNDYzNzUsLTMwLjA1NjI1bDQuMzkyNSwtNzAuMTEzNzVjMC4wODk2LC0xLjY1NzYgLTAuNzYyNjUsLTMuMjcwMDUgLTIuMTk2MjUsLTQuMTIxMjVjLTAuNjk0NCwtMC40MjU2IC0xLjUwMzYsLTAuNjQ0MzUgLTIuMzEsLTAuNjM4NzV6TTM1LjE3NSw0LjUzMjVjLTAuNDMyNiwwLjA2NTEgLTAuODU2OCwwLjE5MjE1IC0xLjI2LDAuMzkzNzVjLTEuNjU3NiwwLjc2MTYgLTIuNjQ0NiwyLjUxMyAtMi41NTUsNC4zMDVsNC4zOTI1LDcwLjExMzc1bC0yMS40NjM3NSwzMC4wNTYyNWMtMC45NDA4LDEuMjU0NCAtMS4xMTcyLDIuOTE1MTUgLTAuNDksNC4zNDg3NWwxMy40NCwzMS4zNmMwLjU4MjQsMS4zNDQgMS43NDM3LDIuMzI4OSAzLjEzMjUsMi42NDI1YzAuMTM0NCwwLjA0NDggNS4yMDM0NSwxLjIwNTA1IDEyLjQxNjI1LDUuNDE2MjVjMC4yNjg4LDAuMTM0NCA2LjkzNjY1LDQuMzk2MzUgMTAuMzg2MjUsNy4yMTg3NWwxLjY2MjUsLTEwLjAzNjI1bDMuNDAzNzUsLTIwLjQzMTI1aC0xMy40NGM3LjQ4MTYsLTM4LjM5MzYgMzMuMjM4NDUsLTY5LjYxNjQgNDIuNjkxMjUsLTgwLjAxbC00OC42NSwtNDQuMjY2MjVjLTEuMDA4LC0wLjkwNzIgLTIuMzY4NDUsLTEuMzA2NTUgLTMuNjY2MjUsLTEuMTExMjV6TTYyLjcyLDEwMy4wNGMwLDAgMy45ODU1OSwyMi40IDE1LjkzMzc1LDIyLjRoMTkuOTA2MjV6TTE2MS4yOCwxMDMuMDRjMCwwIC0zLjk4OTY1LDIyLjQgLTE1Ljk1MTI1LDIyLjRoLTE5Ljg4ODc1ek05NC4wOCwxNjUuNzZoMzUuODRsLTE3LjkyLDI2Ljg4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
        };
    }

    componentWillMount() {
        this.context.emit("stats", {token: cookies.get('token')});
    }

    componentDidMount() {

        this.context.on("stats", (data) => {
            this.setState({
                attack: data.attack,
                health: data.health,
                defence: data.defence,
                level: data.level,
                visibility: 0,
                experience: data.experience,
                encodedPic: "data:image/jpeg;base64," + data.image
            });
        })
    }

    render() {
        return (
            <div>

                {/* Buttons and profile */}

                <button className="smallButton back topLeft"/>;
                <div className="profileCard">
                    <div className="profilePhoto"><img src={this.state.encodedPic}/></div>
                    <h1 className="name">{this.state.name}</h1>
                    <h3 className="smallText">Level {this.state.level}</h3>
                    <div className="xpBar">
                        <div className="xpGained"></div>
                    </div>
                    <h3 className="smallText">{this.state.experience}<b>/350 xp</b></h3>
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
                            <p className="attributeNumber">{this.state.health}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Attack</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.attack}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Defence</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.defence}</p>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValueActive"> </div>
                            <div className="attributeValue"> </div>
                            <div className="attributeValue"> </div>
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Visibility</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.visibility}</p>
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
ProfilePage.contextType = SocketContext;

export default ProfilePage;
