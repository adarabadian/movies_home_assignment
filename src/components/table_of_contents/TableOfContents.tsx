import React, { Component } from "react";
import { Film } from "../../models/Film";
import "./TableOfContents.css";
import axios from "axios";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
import Collapse from "@kunukn/react-collapse";

interface tableOfContentsStates {
  films: Film[],
  favoriteFilms: string[],
  chosenFilm: {},
  activeTab: HTMLElement,
  isCollapserOpen: boolean
}

export default class TableOfContents extends Component<any, tableOfContentsStates> {
  // unsubscribe for redux
  private unsubscribeStore: Unsubscribe;

  // variable for html active tab class
  private activeTab: HTMLElement;
  
  public constructor(props: any) {
    super(props);

    this.state = {
      films: new Array<Film>(),
      favoriteFilms: [],
      chosenFilm: {},
      activeTab: undefined,
      isCollapserOpen: true
    };
  }

  // when component has been mounted get the films and set state accordingly
  async componentDidMount() {
    await this.getAllFilmsFromApi();
    
    this.setFavoritesFromStorage();

    // listen to redux changes
    this.unsubscribeStore = store.subscribe(
      () => this.setState({
            favoriteFilms: store.getState().favoriteFilms,
            chosenFilm: store.getState().chosenFilm
          }, () => {
          })
      );
  }

  componentWillUnmount (){
    // stop subscribing after leaving the component
    this.unsubscribeStore()
}

  // gets all the films from api
  private getAllFilmsFromApi = async () => {
    try {
      const response = await axios.get("https://www.swapi.tech/api/films");
      this.setState({ films: response.data.result });
    } 
    catch (error) {
      console.log(error);
      alert("An error occurred, further info has been printed to console");
    }
  };

  // get favorites from localStorage 
  private setFavoritesFromStorage = () =>{
    // first check if localstorage has any favorites at all, if not, exit the function because you have nothing to work with
    if (localStorage.favoriteFilms === undefined){
      return;
    }

    // get the favorites and parse it in order to set it in redux's store
    let favorites = JSON.parse(localStorage.favoriteFilms);
    store.dispatch({ type: ActionType.setFavoriteFilms, payload: favorites});
    
    // callback for function that will stick each favorite to its movie
    this.attachFavoritesToFilms(favorites);
  }

  // function that's being called after favorites gotten from localstorage
  // it matches each favorites to it's movie
  private attachFavoritesToFilms = (favorites : []) =>{
    // search each favorite it's matching film
    favorites.forEach((filmId: any) => {
      let film : Film = this.state.films.find((film) =>{
        return film.uid === filmId;
      });
      
      // get the index of the film
      let filmIndex = this.state.films.indexOf(film);

      // make a copy of all films
      let allFilms = [...this.state.films];

      // make a copy of the film that will be mutated
      let filmReplica = {...allFilms[filmIndex]};

      // replace the film isLiked attribute
      filmReplica.isLiked = true;

      // put the film back into films array
      allFilms[filmIndex] = filmReplica;

      // set the state as the mutated copy
      this.setState({films : allFilms});
    });
  }

  // function that's being called from html when user clicks a movie
  private chooseSelectedFilm = (film: Film, event: any) => {
    // first change class of the element to be active visually
    this.toggleClass(event);

    store.dispatch({ type: ActionType.setChosenFilm, payload: film});
  }

  private toggleClass = (event: any) =>{
    // first check if there's any active tabs, if there is set its class to inactive
    if (this.activeTab !== undefined){
      let oldActiveTab = this.activeTab;
      oldActiveTab.className = "inactive";
    }
    
    // set the new tab as active and save it in the variable
    event.target.className = "active";
    this.activeTab = event.target;

    // close collapser
    this.setState({isCollapserOpen: !this.state.isCollapserOpen})
  }

  render() {
    return (
      <div id="table-of-contents">
        <h2 onClick={() => this.setState({isCollapserOpen : !this.state.isCollapserOpen})}>
          Movies Catalog  <p>&#9660;</p>
        </h2>

        <Collapse isOpen={this.state.isCollapserOpen}>
          <div id="films-menu">
            {this.state.films.map((film, index) => (
              <div key={index}>
                  <h4 className="inactive" onClick={(event: any) => this.chooseSelectedFilm(film, event)}>
                      {film.properties.title}
                  </h4>
              </div>
            ))}
          </div>
        </Collapse>

      </div>
    );
  }
}

