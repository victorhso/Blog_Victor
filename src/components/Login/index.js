import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './login.css';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password:''
        };

        this.entrar = this.entrar.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount(){
        //Verificar se há algum usuário logado. 
        if(firebase.getCurrent())
            return this.props.history.replace('dashboard');
    }

    entrar(event){
        event.preventDefault();
        this.login();
    }

    login = async () => {
        const {email, password} = this.state;
        try{
            await firebase.login(email, password)
            .catch(err => {
                if(err.code === 'auth/user-npt-found')
                    alert('Usuário não cadastrado.');
                else{
                    alert(err.code)
                    return null;
                }
            })
            this.props.history.replace('/dashboard');
        }catch(err){
            alert(err.message);
        }
    }

    render(){
        return(
            <div>
                <form onSubmit={this.entrar} id="login">
                    <label>Email:</label><br />
                    <input type="email" autoComplete="off" autoFocus value={this.state.email}
                    onChange={(e) => {this.setState({email:e.target.value})}} placeholder="seuemail@provedor.com"
                    /> 
                    <br />
                    <label>Senha:</label><br />
                    <input type="password" autoComplete="off" value={this.state.password}
                    onChange={(e) => {this.setState({password:e.target.value})}} placeholder="Sua senha"
                    />
                    <br />
                    <button type="submit">Entrar</button> <br />
                    <Link to="/register">Ainda não possui uma conta?</Link>
                </form>
            </div>
        );
    }
}

export default withRouter(Login);