import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './register.css';

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            nome:'',
            email: '',
            password:''
        };
        this.register = this.register.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    register(event){
        event.preventDefault();

        this.onRegister();
    }

    onRegister = async () => {
        try{
            const {nome, email, password} = this.state;

            await firebase.register(nome, email, password);
            this.props.history.replace('/dashboard');

        }catch(err){
            alert(err.message);
        }
    }

    render(){
        return(
            <div>
                <h1 className="register-h1">Novo usuário</h1>
                <form onSubmit={this.register} id="register">
                    <label>Nome</label> 
                    <input type="text" value={this.state.nome} autoFocus autoComplete="off" placeholder="seuemail@provedor.com.br"
                        onChange={(e) => this.setState({nome: e.target.value})}/> 
                
                    <label>E-mail</label> 
                    <input type="text" value={this.state.email} autoComplete="off" placeholder="Seu nome"
                        onChange={(e) => this.setState({email: e.target.value})}/> 

                    <label>Senha</label> 
                    <input type="password" value={this.state.password} autoComplete="off" placeholder="*******"
                        onChange={(e) => this.setState({password: e.target.value})}/> 

                    <button type="submit">Cadastrar</button>
                
                </form>
            </div>
        );
    }
}

export default withRouter(Register);