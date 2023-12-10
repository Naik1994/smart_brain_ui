import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'fe11dd6676c341e2824186123570b3b5'
});

const particlesOptions = {
  Particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (userObject) => {
    this.setState({
      user: {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        entries: userObject.entries,
        joined: userObject.joined
      }
    })
  } 

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      left: clarifaiFace.left_col * width,
      top: clarifaiFace.top_row * height,
      right: width - (clarifaiFace.right_col * width),
      bottom: height - (clarifaiFace.bottom_row * height)  
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = (event) => {
    this.setState({ imageUrl: this.state.input })
    app.models
        .predict("general-image-detection", this.state.input)
        .then(response => {
          fetch("http://localhost:3001/image", {
            method: "PUT",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(resp => resp.json())
          .then(data => {
            if (typeof data === 'number') {
              this.setState( Object.assign( this.state.user, {entries: data} ) );
            }
          })
          this.displayFaceBox(this.calculateFaceLocation(response));          
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({isSignedIn: true})
    } else {
      this.setState({isSignedIn: false})
    }
    this.setState({ route });
  }

  render() {
    return (
      <div className="App">
        <Particles className = "particles" params = { particlesOptions }/>
        <Navigation onRouteChange = { this.onRouteChange } isSignedIn = { this.state.isSignedIn }/>
        {
          this.state.route === "signin"    
          ? <Signin loadUser = { this.loadUser } onRouteChange = { this.onRouteChange }/>
          : this.state.route === "home"
          ? <div>
              <Logo />
              <Rank name = { this.state.user.name } rank = { this.state.user.entries } />
              <ImageLinkForm onInputChange = { this.onInputChange } onButtonSubmit = { this.onButtonSubmit } />
              <FaceRecognition imageUrl = { this.state.imageUrl } box = { this.state.box } />
            </div>  
          : <Register loadUser = { this.loadUser } onRouteChange = { this.onRouteChange }/>
        }
      </div>
    );
  }
}

export default App;
