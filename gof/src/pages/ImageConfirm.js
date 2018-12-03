import React from 'react';
import { Redirect } from 'react-router';
import { Link } from "react-router-dom";
import swal from '@sweetalert/with-react';

class ImageConfirm extends React.Component {

    state = {
        redirect : false };

    setRedirect = () => {
        this.setState({redirect: true})
    };

    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/" />}
    };

    redirect() {
        return <Redirect to="/view"/>;
    };

    confirmPhoto() {
        swal({
            title: "Image uploaded!",
            text: "Now fill in the rest of the information!",
            icon: "success",
            button: "Of course!",
        });
    };


    render () {
        return (
            <div className="background">
                <img src={localStorage.getItem("PhotoOfMe")} alt="Photo of me"/>
                <div><h2>Happy with this picture?</h2></div>
                <div>
                    <Link to="/takePicture"><button >No</button></Link>
                    <div className="divider"/>
                    <Link to="/"><button onClick={this.confirmPhoto}>Yes</button></Link>
                </div>
            </div>

        );
    }
}

export default ImageConfirm;