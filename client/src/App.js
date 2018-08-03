import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './Client';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  
  render() {
  return   (<Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/polls">Polls</Link></li>
        <li><Link to="/createpoll">Create New Poll</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route exact path="/about" component={About}/>
      <Route exact path="/polls" component={Polls}/>
      <Route path="/poll/:id" component={PollWithRegex}/>
      <Route exact path="/createpoll" component={CreateNewPoll}/>
      
    </div>
    
  </Router>)
  }
}

const Home = () => (
  <div>
    <h2>Vote Up!</h2>
  </div>
);  

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

class CreateNewPoll extends Component {

  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeOption = this.onChangeOption.bind(this);
    this.state = {
      numberOfOptions: 1,
      maxOptions: 10,
      title: '',
      by: '',
      description: '',
      options: [{ optionName: ''}]
    }
  }

  handleAdd() {
    this.setState({ options: this.state.options.concat([{ optionName: ''}]) });
  }

  onChangeOption = (idx) => (e) => {
    const newOptions = this.state.options.map((option, sidx) => {
      if (idx !== sidx) return option;
      return {...option, optionName: e.target.value};
    });
    this.setState({ options: newOptions });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    console.log(this.state);
  const { title, by, description } = this.state;
  return (
  <div>
    <h2>New Poll</h2>
    <div>
      <form onSubmit={this.onSubmit}>
        Title:<br/>
        <input type="text" name="title" value={title} onChange={this.onChange}/><br/>
        By:<br/>
        <input type="text" name="by" value={by} onChange={this.onChange}/><br/>
        Description:<br/>
        <input type="text" name="description" value={description} onChange={this.onChange}/><br/>
        <br/>
        Options<br/>
        {this.state.options.map((option, idx) => (
        <div>
          Option {idx + 1}
          <input type="text" name={"option"+idx} value={option.optionName} onChange={this.onChangeOption(idx)}/><br/>
          <br/>
        </div>
        ))}
        <button type="button" onClick={this.handleAdd}>Add option</button>
        <br/>
        <input type="submit" value="Submit" />
      </form>
    </div>
  </div>
)
  }
};

class PollWithRegex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    Client.getPoll(this.props.match.params.id, data => {
      this.setState({
        data: data
      });
      console.log(this.state.data.options)
    });
}

  render() {
    var poll = Array.isArray(this.state.data.options) ? this.state.data.options.map((option, idx) => (
      <div>{option.option}: {option.number}</div>
    )) : (<div>Empty!</div>);

    return (
      <div>
        <h3> Poll ID: {this.props.match.params.id} </h3>
        <h3>{this.state.data.title}</h3>
        by {this.state.data.by}
        <br />
        <h3> Poll results: </h3>
        { poll }
    </div>
    )
  }
}

class Polls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    Client.search("", data => {
      this.setState({
        data: data.slice(0, 10)
      });
    });
  }

  render() {
    var polls = this.state.data.map((poll, idx) => (
      <div><Link to={"/poll/"+poll._id}>{poll.title} By {poll.by}</Link>
      <br />
      </div>
      ));
    
    return (
      <div>
        <h3>Polls</h3>
        {polls}
      </div>
      );
  }
}

export default App