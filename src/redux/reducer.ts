import { AppState } from "./app-state";
import { ActionType } from "./action-type";
import { Action } from "./action";

export function reduce(oldAppState: AppState, action: Action): AppState {
    // Cloning the oldState (creating a copy)
    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.setFavoriteFilms:
            newAppState.favoriteFilms = action.payload;
            break;

        case ActionType.setChosenFilm:
            newAppState.chosenFilm = action.payload;
            break;
    }
    
    return newAppState;
}