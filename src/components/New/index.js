import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "./new.css";

class New extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titulo: "",
      imagem: null,
      url: "",
      descricao: "",
      alert: "",
      progress: 0,
    };

    this.cadastrar = this.cadastrar.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    if (!firebase.getCurrent()) {
      this.props.history.replace("/");
      return null;
    }
  }

  cadastrar = async (e) => {
    e.preventDefault();

    if (
      this.state.titulo !== "" &&
      this.state.imagem !== "" &&
      this.state.descricao !== "" &&
      this.state.imagem !== null &&
      this.state.url !== ""
    ) {
      let posts = firebase.app.ref("Posts");
      let chave = posts.push().key;
      await posts.child(chave).set({
        titulo: this.state.titulo,
        image: this.state.url,
        descricao: this.state.descricao,
        autor: localStorage.nome,
      });

      this.props.history.push("/");
    } else {
      alert('Post cadastrado com sucesso!');
      this.setState({ alert: "Preencha todos os campos!" });
    }
  };

  handleFile = async (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/png" || image.type === "image/jpeg") {
        await this.setState({ imagem: image });
        await this.handleUpload();
      } else {
        alert("Envie uma imagem do tipo PNG ou JPG");
        this.setState({ imagem: null });
        return null;
      }
    }
  };

  handleUpload = async () => {
    const { imagem } = this.state;
    const currentUid = firebase.getCurrentUid();

    const uploadTaks = firebase.storage
      .ref(`images/${currentUid}/${imagem.name}`)
      .put(imagem);

    await uploadTaks.on(
      "state_changed",
      (snapshot) => {
        //progress
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        //error
        console.log("Error imagem: " + error);
      },
      () => {
        //sucessO!
        firebase.storage
          .ref(`images/${currentUid}`)
          .child(imagem.name)
          .getDownloadURL()
          .then((url) => {
            this.setState({ url: url });
          });
      }
    );
  };

  render() {
    return (
      <div>
        <header id="new">
          <Link to="/dashboard">Voltar</Link>
        </header>
        <form onSubmit={this.cadastrar} id="new-post">
          <span>{this.state.alert}</span>

          <input type="file" onChange={this.handleFile} />
          {this.state.url !== "" ? (
            <img
              src={this.state.url}
              width="250"
              height="150"
              alt="Capa do post"
            />
          ) : (
            <progress value={this.state.progress} max="100" />
          )}

          <label>Titulo:</label>
          <input
            type="text"
            placeholder="Nome do post"
            value={this.state.titulo}
            autoFocus
            onChange={(e) => this.setState({ titulo: e.target.value })}
          />
          <br />

          <label>Descrição:</label>
          <textarea
            type="text"
            placeholder="Alguma descrição..."
            value={this.state.descricao}
            onChange={(e) => this.setState({ descricao: e.target.value })}
          />
          <br />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
  }
}

export default withRouter(New);
