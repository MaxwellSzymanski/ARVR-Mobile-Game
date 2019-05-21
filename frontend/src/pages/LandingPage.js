import React from 'react';
import { Redirect } from 'react-router';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class LandingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
        };
        cookies.set("fieldtest", props.match.params.token)
    }

    componentDidMount() {
        setTimeout( () => {
            this.setState({ redirect: true})
        }, 2000)
    }

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/" />}
    };

    render () {

        return (
            <div className="background">
                {this.renderRedirect()}
                <div>
                    <ltitle>WhereWolf</ltitle>
                </div>
                <div>
                    <lsubtitle>Kill or be killed</lsubtitle>
                </div>
            </div>
        );
    }
}

export default LandingPage;
