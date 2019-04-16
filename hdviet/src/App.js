import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactPlayer from 'react-player'

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {

      isLoading: false,
      isError: '',
      results: [],
      searchText: '',
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
    this.currentItem = null;
    this.playUrl = ''

  }

  componentDidMount(){
    this.requestMoviesList()
  }

  requestMoviesList = async () => {

    this.setState({ isLoading: true });

    const url = `http://movies.hdviet.com/tim-kiem-nhanh.html?keyword=trans`
    
    console.log(url)

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('res:', data.Title);

        this.setState({
            isLoading: false,
            isError: '',
            results: data.Title
        });

      })
      .catch(error => {
        console.log(error);
        this.setState({
              isLoading: false,
              isError: error
            });
      });
  };

  getPlayUrl = async () => {


    const url = `http://movies.hdviet.com/get_movie_play_json?movieid=${this.currentItem.MovieID}&sequence=1`
    
    console.log(url)

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('res:', data);
        this.playUrl = data.data.playList
        this.setState({
          modal:true
        });

      })
      .catch(error => {
        console.log(error);
        this.setState({
              isLoading: false,
              isError: error
            });
      });
  };


  onClickItem(item){
    console.log(item.MovieID)
    this.currentItem = item
    this.getPlayUrl()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }


  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          
            save to reload.
          
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>

        <div className="App-body">
            {
              Object.keys(this.state.results).map(key => 
                <MovieItem key={key} item={this.state.results[key]} onClick={()=> this.onClickItem(this.state.results[key])}/>
              )
            }
          </div>
          {this.currentItem &&
            

          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >

            <ModalHeader color={{backgroundColor:'black'}} toggle={this.toggle}> {this.currentItem.MovieName} </ModalHeader>
            <ModalBody style={{backgroundColor:'black'}}>
            <ReactPlayer url={this.playUrl} width={468}  playing controls/>
            </ModalBody>
            <ModalFooter>
            <Button color="success" onClick={this.toggle}>Open JWPlayer</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>

          </Modal>
          
          }


      </div>
    );
  }
}

