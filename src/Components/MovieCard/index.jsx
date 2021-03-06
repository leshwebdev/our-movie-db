import React, { useState, useEffect } from "react";
import { useHistory} from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import {Card, Button} from "@material-ui/core";
import Favorite from "../../Components/Favorite/index"
import StarIcon from '@material-ui/icons/Star';
import service from "../../Services/service";

const useStyles = makeStyles({
  card: {
    height: 280,
    transition: `transform 0.3s ease 0s`,
    transformStyle: `preserve-3d`,
    position: `relative`,
    '&:hover': {
      transform: `rotateY(180deg)`,
    }
  },
  movieCard: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    position: `absolute`,
    borderRadius: `4px`,
    width: `100%`,
    height: `100%`,
    backgroundImage: (state) => state.imgUrl,
    backfaceVisibility: `hidden`,
    backgroundRepeat: `no-repeat`,
    backgroundSize: `100% 100%`,
  },
  front: {
  },
  back: {
    transform: `rotateY(180deg)`
  },
  title: {
    backgroundColor: `aqua`,
    width: `90%`,
    position: `absolute`,
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: `4px`,
    borderBottomRightRadius: `4px`,
    textAlign: `center`,
    whiteSpace: `nowrap`,
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    padding: `0px 10px 0px 10px`,
    fontWeight: `500`
  },
  badges: {
    position: `absolute`,
    width: `94%`,
    top: 10,
    padding: `0px 5px 0px 5px`,
    display: `flex`,
    justifyContent: `space-between`,
  },
  badge: {
    backgroundColor: `aqua`,
    borderRadius: `4px`,
    textAlign: `center`,
    padding: `0px 5px 0px 5px`,
    fontWeight: `500`
  },
  rating: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`
  },
  star: {
    color: `yellow`
  },
  detailsBtn: {
    '&:hover': {
      color: `black`,
      backgroundColor: `aqua`,
      transform: `translateY(-2px)`
    }
  }
});

function MovieCard(props) {
  const [state, setState] = useState({
    imdbId: null,
    imgUrl: null
  });

  const history = useHistory();
  const classes = useStyles(state);
  
  useEffect(() => {
    async function getByExternalId(id) {
      const gottenMovieId = await service.getExternalId(id);
      const imdbId = gottenMovieId.imdb_id;
      const gottenMovie = await service.getMovieFromOMDBByIMDBId(imdbId);
      if (gottenMovie.Poster) {
        setState((state) => ({...state, imdbId, imgUrl: `url("${gottenMovie.Poster}")` }));
      } else {
        setState((state) => ({...state, imdbId, imgUrl: getImgUrl(props.posterPath) }));
      }
    } 
    getByExternalId(props.movieId);
  }, [props.movieName, props.posterPath]);

  const getImgUrl = (posterPath) => {
    return `url(https://image.tmdb.org/t/p/original${posterPath})`
  }

  return (
    <div className={classes.card}>
      <Card className={`${classes.movieCard} ${classes.front}`}>
          <div className={classes.badges}>
            <div className={classes.badge}>
              {props.movieReleaseYear}
            </div>
            <div className={`${classes.badge} ${classes.rating}`}>
              <StarIcon className={classes.star}></StarIcon>
              {props.movieRating}
            </div>
          </div>
          <div className={classes.title}>
            {props.movieName}
          </div>
      </Card>
      <Card className={`${classes.movieCard} ${classes.back}`}>
          <Button className={classes.detailsBtn} variant="contained" color="primary" onClick={() => history.push(`/movie/${state.imdbId}`)}>
            Details
          </Button>
          <div className={classes.title}>
            <Favorite favMovies={props.favMovies} onToggleIsFavorite={props.onToggleIsFavorite} movieId={state.imdbId} />
            <div>{props.movieName}</div>
          </div>
      </Card>
    </div>
  );
}

export default MovieCard;
