import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import SocketContext from "../socketContext";
import swal from '@sweetalert/with-react';
const cookies = new Cookies();

class EmailVerif extends React.Component {
    constructor() {
        super();

        this.state = {
            firstTry: true,
            loading: false,
            redirect: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.refs["code_1"].focus();

        const that = this;
        this.context.on("verify", function (response) {
            if (response.success) {
                swal("Your e-mail has been verified.", {icon: "success"}).then( () => {
                    swal("Faction chooser", "Select a faction. The icons indicate how crowded a faction is. " +
                        "The more people join it, the weaker the players, so choose wisely!");
                    that.setState({redirect: true});
                });
            } else {
                swal("That code seems to be wrong. Please try again or let us send you another code.", {icon: "error"});
                that.setState({firstTry: false, loading: false})
            }
        });
    }

    formComplete() {
        let a = this.state;
        return (a.code_1 && a.code_2 && a.code_3 && a.code_4 && a.code_5 && a.code_6);
    }

    async handleChange(e) {
        let target = e.target;
        if (target.value > 9 || target.value < 0) {
            target.value = target.value % 10;
        }
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name + "_" + target.id;

        this.setState({
            [name]: value
        });

        let next = target.name + "_" + (parseInt(target.id) + 1).toString();

        if (value === "") {

        } else {
            if (next && next === "code_7") {
                this.refs["code_1"].focus();
            } else if (next) {
                this.refs[next].focus();
            }
        }
    }

    newCode() {
        this.context.emit("newmail", {token: cookies.get('token')});
        this.setState({firstTry: true});
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.setState({loading: true});

        let a = this.state;
        let code = parseInt(a.code_1 + a.code_2 + a.code_3 + a.code_4 + a.code_5 + a.code_6);

        const dataToSend = {
            code: code,
            token: cookies.get('token')
        };

        this.context.emit("verify", dataToSend);
    }

    state = {
        redirect : false };


    renderRedirect = () => {
        if (this.state.redirect) {return <Redirect to="/factionChooser" />}
    };

    setPage() {
        document.body.style = 'background: #cc1f10'
    };

    render() {

        return (
            <div className="background">
                {this.renderRedirect()}
                {this.setPage()}
                <div>
                    <h1>Game Of Wolves</h1>
                </div>
                <div className="FormCenter colorWhite">
                    <form onSubmit={this.handleSubmit} className="FormFields">
                    <div className="FormField colorWhite">
                        <p>A six digit verification code has been sent to your e-mail account. Enter it below.</p>
                        <p>If you can't find it in your inbox, please check your spam folder.</p>
                        <div className="VerificationCode">
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_1" id="1" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_2" id="2" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_3" id="3" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_4" id="4" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_5" id="5" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                            <div className="VerificationCodeDigit">
                                <input type="number" ref="code_6" id="6" name="code" className="VerificationCodeDigit__Input" value={this.state.code} onChange={this.handleChange} min="0" max="9"/>
                            </div>
                        </div>
                        <div className="FormField">
                            {this.formComplete() && !this.state.loading && <button className="FormField__Button mr-20">Verify me!</button>}
                            {this.state.loading && <p>Checking your code ...</p>}
                        </div>
                    </div>
                    </form>
                </div>
                <div className="FormCenter">
                    <form onSubmit={this.newCode} className="FormFields">
                        <div className="FormField">
                            {!this.state.firstTry && !this.state.loading && <button className="FormField__Button mr-20"> Send me another code</button>}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
EmailVerif.contextType = SocketContext;

export default EmailVerif;
