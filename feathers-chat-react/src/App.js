import React, { Component } from "react";
import "./App.css";
import client from "./feathers";

class App extends Component {
  state = {
    currentUser: null,
    messageTo: null,
    email: "",
    password: "",
    authenticated: false,
    message: "",
    messages: [],
    users: [],
    channels: []
  };

  handleLogin = e => {
    const { email, password } = this.state;

    client
      .authenticate({
        strategy: "local",
        email,
        password
      })
      .then(response => {
        this.setState({ email: "", password: "", authenticated: true, currentUser: response.user });
        this._getAllMessages();
        this._getConnectedUsers();
        localStorage.setItem("current-user", JSON.stringify(response.user));

        // return client.passport.verifyJWT(response.accessToken);
      });
    // .then(payload => {
    //   console.log("JWT Payload", payload);
    //   // return app.service("users").get(payload.userId);
    // });

    e.preventDefault();
  };

  handleSignup = e => {
    const { email, password } = this.state;
    client
      .service("users")
      .create({
        email,
        password
      })
      .then(user => {
        this.setState({ email: "", password: "" });
      });
    e.preventDefault();
  };

  handleInputField = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  handleLogOut = () => {
    client.logout();
  };

  handleCreateChannel = () => {
    console.log("creating channel");
  };

  handleMessageInput = e => {
    e.preventDefault();
    client
      .service("messages")
      .create({
        from: this.state.currentUser._id,
        to: this.state.messageTo,
        text: this.state.message
      })
      .then(() => {
        this.setState({ message: "" });
      });
  };

  componentWillMount() {
    if (localStorage.getItem("feathers-jwt")) {
      this.setState({ authenticated: true });
    }

    const currentUser = localStorage.getItem("current-user");
    if (currentUser) {
      this.setState({ currentUser: JSON.parse(currentUser) });
    }
  }

  _getConnectedUsers = () => {
    client.authenticate().then(() => {
      client
        .service("connected-users")
        .find()
        .then(users => {
          this.setState({ users });
        });
    });
  };

  _getAllMessages = arg => {
    if (arg) {
      return client
        .service("messages")
        .find({
          query: {
            $or: [
              { $and: [{ to: this.state.currentUser._id }, { from: arg }] },
              { $and: [{ from: this.state.currentUser._id }, { to: arg }] }
            ]
          }
        })
        .then(messages => {
          this.setState({ messages: messages.data });
        });
    }

    return client
      .service("messages")
      .find({
        query: {
          $or: [{ to: this.state.currentUser._id }, { from: this.state.currentUser._id }]
        }
      })
      .then(messages => {
        this.setState({ messages: messages.data });
      });
  };

  componentDidMount() {
    client.service("messages").on("created", message => {
      const messages = this.state.messages;
      messages.push(message);
      this.setState({ messages });
    });

    client
      .authenticate()
      .then(() => {
        if (!this.state.channels.length > 0) {
          client
            .service("channels")
            .find()
            .then(channels => {
              this.setState({ channels });
            });
        }

        if (!(this.state.messages.length > 0)) {
          this._getAllMessages();
        }

        if (!(this.state.users.length > 0)) {
          this._getConnectedUsers();
        }
      })
      .catch(err => {
        console.log("you have to login first");
      });

    client.on("logout", () => {
      this.setState({
        authenticated: false,
        messages: [],
        users: []
      });
      localStorage.removeItem("current-user");
    });

    client.on("login", (data, ctx) => console.log(data, ctx));
  }

  render() {
    const { authenticated } = this.state;

    return (
      <div className="App">
        {!authenticated && (
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
                  name="email"
                  value={this.state.email}
                  onChange={event => this.handleInputField("email", event)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={event => this.handleInputField("password", event)}
                />
              </div>

              <button onClick={this.handleLogin} type="submit" className="btn btn-success">
                login
              </button>

              <button onClick={this.handleSignup} type="submit" className="btn btn-primary ml-2">
                register
              </button>
            </form>
          </div>
        )}

        {/* ---------------- chat screen ----------------- */}

        {authenticated && (
          <div className="container">
            <div className="row" style={{ height: "400px" }}>
              <div style={{ paddingTop: 15 }} className="col-3 bg-secondary">
                <button onClick={this.handleLogOut} type="submit" className="btn btn-primary mb-5">
                  LogOut
                </button>

                <form onSubmit={this.handleCreateChannel}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="#channel"
                    value={this.state.channel}
                    onChange={event => this.handleInputField("channel", event)}
                  />

                  <button type="submit" className="btn btn-primary mb-2">
                    Create +
                  </button>
                </form>

                <ul className="channels">
                  {this.state.currentUser.channels.map((channel, index) => (
                    <li onClick={() => console.log("have to update channel handler")} key={index}>
                      #{channel}
                    </li>
                  ))}
                </ul>

                <ul className="users">
                  {this.state.users.map(user => (
                    <li
                      onClick={() => {
                        this.setState({ messageTo: user._id });
                        this._getAllMessages(user._id);
                      }}
                      key={user._id}
                    >
                      {user.email}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-9 bg-light">
                <div
                  className="chat_body"
                  style={{
                    paddingTop: 15,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    display: "flex"
                  }}
                >
                  <ul style={{ height: "370px" }}>
                    {this.state.messages.map(message => (
                      <li key={message._id}>
                        <strong>{message.from}</strong> {message.text}
                      </li>
                    ))}
                  </ul>
                  <div className="messageInput">
                    <form className="form-inline" onSubmit={this.handleMessageInput}>
                      <input
                        type="text"
                        className="form-control mb-2 col-9"
                        id="inlineFormInputName2"
                        placeholder="Message"
                        value={this.state.message}
                        onChange={event => this.handleInputField("message", event)}
                      />

                      <button type="submit" className="btn btn-primary mb-2 col-2 offset-1">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
