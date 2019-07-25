import React, {Component} from 'react';
import './App.css';
import client from './feathers';

class App extends Component {

  state = {
    email: '',
    password: ''
  }

  login = (e) => {
    e.preventDefault();
    client.authenticate({
      strategy: "local",
      email: this.state.email,
      password: this.state.password
    });
    console.log(client)
  }

  handleEmail = (event) => {
    this.setState({email: event.target.value});
  }
  handlePassword = (event) => {
    this.setState({password: event.target.value});
  }

  render() {
  return (
    <div className="App">
      <div className="loginform">

        <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={this.state.email} onChange={this.handleEmail}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={this.state.password} onChange={this.handlePassword} />
        </div>

        <button onClick={this.handleLogin} type="submit" className="btn btn-success">
          login
        </button>

        <button onClick={this.handleSignup} type="submit" className="btn btn-primary">
          register
        </button>
      </form>

      </div>
    </div>
  )
  }
}

export default App;
