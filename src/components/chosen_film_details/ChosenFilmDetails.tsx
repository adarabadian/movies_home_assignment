import React, { Component } from "react";
import "./ChosenFilmDetails.css";
import { Film } from "../../models/Film";
import redHeart from "../../assets/red-heart.png";
import blackHeart from "../../assets/black-heart.png";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";

interface chosenFilmDetailsState {
  film: Film;
}

export default class ChosenFilmDetails extends Component<any, chosenFilmDetailsState> {
  private unsubscribeStore: Unsubscribe;

  public constructor(props: any) {
    super(props);

    this.state = {
      film: store.getState().chosenFilm,
    };
  }

  componentDidMount() {
    // listen to redux changes
    this.unsubscribeStore = store.subscribe(() =>
      this.setState(
        {
          film: store.getState().chosenFilm,
        },
        () => {}
      )
    );
  }

  componentWillUnmount() {
    // stop subscribing after leaving the component
    this.unsubscribeStore();
  }

  private toggleIsLikedStatus = () => {
    // duplicate the film and invert its isLiked status
    let newFilm = this.state.film;
    newFilm.isLiked = !newFilm.isLiked;

    // save the new favorites status at localStorage
    this.changeLocalStorageFavorites(newFilm);

    // update the state accordingly
    this.setState({ film: newFilm });
  };

  private changeLocalStorageFavorites = (film: Film) => {
    // first get the favorites array from redux's store
    let favoriteFilms = this.getFavoriteFilmsFromStore();

    // in case the film is now liked add it's id to the array
    if (film.isLiked) {
      favoriteFilms.push(film.uid);
    } 
    // in case of unlike get the index of the film's id and splice it
    else {
      let index = favoriteFilms.indexOf(film.uid);
      // if index was found - splice it
      if (index !== -1) {
        favoriteFilms.splice(index, 1);
      }
    }

    // set the localStorage with the updated favorites
    localStorage.setItem("favoriteFilms", JSON.stringify(favoriteFilms));

    // update redux's store accordingly
    store.dispatch({type: ActionType.setFavoriteFilms, payload: [favoriteFilms]});
  };

  // get favorites from redux's store
  private getFavoriteFilmsFromStore = (): any => {
    let favoritesFromStore = store.getState().favoriteFilms;
    
    // if favorites is undefined just return an empty array, else return parsed result
    if (favoritesFromStore === undefined){
      return [];
    }

    return JSON.parse(localStorage.favoriteFilms);
  } 

  render() {
    return (
      <div id="chosen-film-details">
        {/* if there's no film chosen */}
        {this.state.film === undefined && (
          <div>
            <h2>
              Please select a film from the table of contents.
            </h2>
          </div>
        )}

        {/* if there's a film chosen */}
        {this.state.film !== undefined && (
          <div>
            <h2>{this.state.film.properties.title}</h2>

            <p>{this.state.film.properties.opening_crawl}</p>

            <button
              onClick={() => {
                this.toggleIsLikedStatus();
              }}
            >
              {/* conditional rendering for button */}
              {!this.state.film.isLiked && <img src={blackHeart} alt=""></img>}
              {this.state.film.isLiked && <img src={redHeart} alt=""></img>}
            </button>
          </div>
        )}
      </div>
    );
  }
}
