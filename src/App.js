import React, { Component } from 'react'
import './App.css'

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='

const largeColumn = {
  width: '40%',
};

const midColumn = {
  width: '30%',
};

const smallColumn = {
  width: '10%',
};

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
  }

  setSearchTopStories(result) {
    this.setState({ result })
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    })
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  render() {
    const { searchTerm, result } = this.state
    if (!result) { return null }
    return (
      <div className="page">
        <div className="interaction">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
          {result &&
            <Table
              list={result.hits}
              onDismiss={this.onDismiss}
            />
          }
        </div>
      </div>
    )
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>


const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

export default App;
