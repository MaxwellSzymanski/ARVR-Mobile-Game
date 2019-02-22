import React from 'react';
import { Link } from 'react-router-dom';
import "./profilePage.css"
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";

const cookies = new Cookies();

class ProfilePage extends React.Component {
    constructor() {
        super();
        this.xpBar = React.createRef();
        this.state = {
            name: cookies.get('name'),
            health: 300,
            attack: 100,
            defence: 200,
            level: 1,
            visibility: 50,
            experience: 30,
            //encodedPic: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAyMjQgMjI0IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNHYtMjI0aDIyNHYyMjR6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iIzc1MGMwNCI+PHBhdGggZD0iTTE4OC4xMzM3NSw0LjQ3MTI1Yy0wLjgwNjQsMC4wMDU2IC0xLjYwNjg1LDAuMjM0NSAtMi4zMDEyNSwwLjY4MjVjLTAuNDQ4LDAuMjY4OCAtMi41NTYwNSwxLjU2NjI1IC01Ljg3MTI1LDMuODA2MjVjMCwwIC0wLjIyNTc1LDAuMTc3NDUgLTAuNjczNzUsMC40NDYyNWMtNi4wMDMyLDQuNDggLTUwLjI2MzUsMzguMTI2NTUgLTYyLjgwNzUsNzUuNzEzNzVsMjIuNCwtNC40OGMwLDAgLTQxLjg4NjYsMzcuNjczNjUgLTU2LjgwNSwxMDAuOTMxMjVjMCwtMC4wNDQ4IC0xLjk5NSw4LjgzMDE1IC0yLjU1NSwxNC43NDM3NWMwLjc2MTYsMS43NDcyIDEuNTIzMiwzLjUzNDY1IDIuMjQsNS40MTYyNWMwLjA0NDgsMC4xMzQ0IDIuNTA0Niw2LjcxODk1IDMuNTM1LDEwLjEyMzc1YzAuNTgyNCwxLjg4MTYgMi4zMzM4LDMuMTg1IDQuMzA1LDMuMTg1aDQ0LjhjMS45NzEyLDAgMy43MjI2LC0xLjMwMzQgNC4zMDUsLTMuMTg1YzE2Ljg0NDgsLTU0Ljc5MDQgNTMuNDAwNTUsLTYzLjc4ODkgNTQuOTIzNzUsLTY0LjEwMjVjMS4zODg4LC0wLjMxMzYgMi41NTAxLC0xLjI5ODUgMy4xMzI1LC0yLjY0MjVsMTMuNDQsLTMxLjM2YzAuNjI3MiwtMS40MzM2IDAuNDUwOCwtMy4wOTQzNSAtMC40OSwtNC4zNDg3NWwtMjEuNDYzNzUsLTMwLjA1NjI1bDQuMzkyNSwtNzAuMTEzNzVjMC4wODk2LC0xLjY1NzYgLTAuNzYyNjUsLTMuMjcwMDUgLTIuMTk2MjUsLTQuMTIxMjVjLTAuNjk0NCwtMC40MjU2IC0xLjUwMzYsLTAuNjQ0MzUgLTIuMzEsLTAuNjM4NzV6TTM1LjE3NSw0LjUzMjVjLTAuNDMyNiwwLjA2NTEgLTAuODU2OCwwLjE5MjE1IC0xLjI2LDAuMzkzNzVjLTEuNjU3NiwwLjc2MTYgLTIuNjQ0NiwyLjUxMyAtMi41NTUsNC4zMDVsNC4zOTI1LDcwLjExMzc1bC0yMS40NjM3NSwzMC4wNTYyNWMtMC45NDA4LDEuMjU0NCAtMS4xMTcyLDIuOTE1MTUgLTAuNDksNC4zNDg3NWwxMy40NCwzMS4zNmMwLjU4MjQsMS4zNDQgMS43NDM3LDIuMzI4OSAzLjEzMjUsMi42NDI1YzAuMTM0NCwwLjA0NDggNS4yMDM0NSwxLjIwNTA1IDEyLjQxNjI1LDUuNDE2MjVjMC4yNjg4LDAuMTM0NCA2LjkzNjY1LDQuMzk2MzUgMTAuMzg2MjUsNy4yMTg3NWwxLjY2MjUsLTEwLjAzNjI1bDMuNDAzNzUsLTIwLjQzMTI1aC0xMy40NGM3LjQ4MTYsLTM4LjM5MzYgMzMuMjM4NDUsLTY5LjYxNjQgNDIuNjkxMjUsLTgwLjAxbC00OC42NSwtNDQuMjY2MjVjLTEuMDA4LC0wLjkwNzIgLTIuMzY4NDUsLTEuMzA2NTUgLTMuNjY2MjUsLTEuMTExMjV6TTYyLjcyLDEwMy4wNGMwLDAgMy45ODU1OSwyMi40IDE1LjkzMzc1LDIyLjRoMTkuOTA2MjV6TTE2MS4yOCwxMDMuMDRjMCwwIC0zLjk4OTY1LDIyLjQgLTE1Ljk1MTI1LDIyLjRoLTE5Ljg4ODc1ek05NC4wOCwxNjUuNzZoMzUuODRsLTE3LjkyLDI2Ljg4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
            encodedPic: "data:image/png;base64,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"
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
            });
        })
        this.context.on("photo", (data) => {
            this.setState({
                encodedPic: data.image
            })
        })
    }

    generateAttributes(number) {
        let active = 0;
        if (number != 0) {active = Math.round(number / 100);}
        let html = []
        for (var i = 1; i <= active; i++) {
            html.push(<div key={i} className="attributeValueActive"></div>)
        }
        if (active != 4) {
            for (var i = 1; i <= 4-active; i++) {
                html.push(<div key={5+i} className="attributeValue"></div>)
            }
        }
        return html
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
                        <div className="xpGained" style={{width: 'calc(${this.state.experience}/100%)'}}> </div>
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
                            {this.generateAttributes(this.state.health)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Attack</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.attack}</p>
                            {this.generateAttributes(this.state.attack)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Defence</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.defence}</p>
                            {this.generateAttributes(this.state.defence)}
                        </div>
                    </div><hr className="shorterLine"/>
                    <div className="attributeContainer">
                        <h3 className="attributeTitle">Visibility</h3>
                        <div className="attributeValueContainer">
                            <p className="attributeNumber">{this.state.visibility}</p>
                            {this.generateAttributes(this.state.visibility)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ProfilePage.contextType = SocketContext;

export default ProfilePage;
