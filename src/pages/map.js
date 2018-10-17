import React from 'react';
import { Link } from 'react-router-dom';


class Map extends React.Component {
    constructor() {
        super();

        this.state = {
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        console.log('The form was submitted with the following data:');
        console.log(this.state);
    }

    render() {
        return (
        <div className="Map">
            {/* eslint-disable-next-line*/}

          </div>
        );
    }
}

export default Map;
