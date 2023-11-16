import React from 'react';
import { Vortex } from 'react-loader-spinner';
import { getFunctions, httpsCallable } from "firebase/functions";

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: '',
            isError: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (event) => {
        await this.setState({ loading: true });
        httpsCallable(getFunctions(), 'sendPasswordResetEmail')({ email: event.target.email.value })
            .then(async () => {
                await this.setState({ loading: false, message: 'Please check your email', isError: false });
            })
            .catch(async () => {
                await this.setState({ loading: false, message: 'Error sending email; please try again later', isError: true });
            });

        event.preventDefault();
    }

    renderMessage = () => {
        if (!this.state.message) return <></>;

        const textStyle = this.state.isError ? { 'color': 'red' } : { 'color': 'green' };
        return <><br/><br/><text style={textStyle}>{this.state.message}</text></>;
    }

    render() {
        return (
            <div class="form" style={{ 'display': 'inline-block' }}>
                <div class="form-title">Reset password</div>
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label><br/>
                    <input type="text" class="field" name="email"/>
                    <br/>
                    <input type="submit" class="form-btn btn" value="Send link"/>
                    {this.renderMessage()}
                    {this.state.loading && <Vortex colors={['#eea76a', '#b84410', '#eea76a', '#b84410', '#b84410', '#eea76a']} width={50} height={50}/>}
                </form>
            </div>
        );
    }
}

export default ForgotPassword;
