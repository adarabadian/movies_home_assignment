import { FilmProperties } from "./FilmProperties";

export class Film {
    public constructor(
        public uid : string,
        public properties : FilmProperties,
        public isLiked : boolean = false
    ){}
}

