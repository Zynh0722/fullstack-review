import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    }
    this.fetch();
  }

  search (term) {
    console.log(`${term} was searched`);
    axios.post('/repos', { term })
      .then(() => {
        this.fetch();
      });
  }

  fetch () {
    axios.get('/repos')
      .then((res) => {
        this.setState({
          repos: res.data
        });
      });
  }

  render () {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos}/>
      <Search onSearch={this.search.bind(this)}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));