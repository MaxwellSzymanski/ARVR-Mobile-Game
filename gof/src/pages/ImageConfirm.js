import React from 'react';
import { Redirect } from 'react-router';
import {Link} from "react-router-dom";

class ImageConfirm extends React.Component {

    state = {
        redirect : false }

    setRedirect = () => {
        this.setState({redirect: true})
    }

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/" />}
    }

    redirect() {
        return <Redirect to="/view"/>;
    }


    render () {
        return (
            <div className="Title">
                <img src={localStorage.getItem("PhotoOfMe")} alt="Photo of me"/>
                <div><h2>Happy with this picture?</h2></div>
                <div>
                    <Link to="/takePicture"><button className="large red button">No</button></Link>
                    <div className="divider"/>
                    <Link to="/"><button className="large red button">Yes</button></Link>
                </div>
            </div>

        );
    }
}

export default ImageConfirm;