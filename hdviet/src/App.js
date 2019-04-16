import React, { Component } from 'react';
import './App.css';
import MovieItem from './MovieItem'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class App extends Component {

  constructor(props){
    super(props)
    this.state = {

      isLoading: false,
      isError: '',
      results: [],
      searchText: '',
      modal: false
    };

    this.toggle = this.toggle.bind(this);
    this.currentItem = null;

  }

  componentDidMount(){
    this.requestMoviesList()
  }

  requestMoviesList = async () => {

    this.setState({ isLoading: true });

    const url = `http://movies.hdviet.com/tim-kiem-nhanh.html?keyword=hay`
    
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

  onClickItem(item){
    console.log(item.MovieID)
    this.currentItem = item
    this.setState({modal:true})
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
            

          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>{this.currentItem.MovieName}</ModalHeader>
            <ModalBody>
              
              <video id="samp"  controls>
                    <source src = "http://freeb.hdviet.com/80d4f85dad54daff5019d454788c91c8/s8/102015/21/v_h_s_2012_bluray_1080p_dts_x264_chd/playlist_m.m3u8" type="application/x-mpegURL" >
                        {/* Your browser does not support this video format. */}
                    </source>
                </video>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={this.toggle}>Open</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          
          }


      </div>
    );
  }
}

