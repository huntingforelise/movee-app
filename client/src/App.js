import "./App.css";
import SignIn from "./components/SignIn";
import GameList from "./components/GameList";
import Organise from "./components/Organise";
import Account from "./components/Account";
import * as ApiClient from "./ApiClientService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import image from "./assets/BusinessCard.JPG";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [games, setGames] = useState([]);
  const [joinedGames, setJoinedGames] = useState([]);
  const navigate = useNavigate();

  const filterGames = (arr) => {
    if (loggedIn) {
      const myGames = [];
      for (const game of arr) {
        for (const id of game.subscribedlist) {
          if (id === user._id) {
            myGames.push(game);
          }
        }
      }
      return myGames;
    }
  };

  function logIn(user) {
    ApiClient.postUser(user)
      .then((user) => {
        if (user) {
          const output = true;
          setLoggedIn(output);
          setUser(user);
        }
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    ApiClient.getGames(user)
      .then((games) => {
        setGames(games);
        if (loggedIn) {
          const filteredGames = filterGames(games);
          setJoinedGames(filteredGames);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [user]);

  function postGame(game) {
    ApiClient.postGame({
      date: game.date,
      beach: game.beach,
      maxplayers: game.maxplayers,
      level: game.level,
    })
      .then((newGame) => {
        setGames([...games, newGame]);
      })
      .catch((error) => console.log(error));
  }

  function joinGame(fullGameObject, userObject) {
    ApiClient.joinGame(fullGameObject, userObject)
      .then((updatedGame) => {
        const newGames = [...games];
        for (const newGame of newGames) {
          if (newGame._id === updatedGame._id) {
            const updatedPlayers = updatedGame.subscribedlist.length;
            newGame.subscribedlist.length = updatedPlayers;
          }
        }
        setGames(newGames);
        const gameID = updatedGame._id;
        if (!userObject.gameslist.includes(gameID)) {
          setJoinedGames([...joinedGames, updatedGame]);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      <header>
        <img src={image} alt="bola-logo" />
      </header>
      {loggedIn ? (
        <div className="body-container">
          <Routes>
            <Route
              path="/"
              element={
                <GameList
                  games={games}
                  joinGame={joinGame}
                  user={user}
                  joined={false}
                />
              }
            />
            <Route
              path="/gamelist"
              element={
                <GameList
                  games={games}
                  joinGame={joinGame}
                  user={user}
                  joined={false}
                />
              }
            />
            <Route
              path="/organise"
              element={<Organise postGame={postGame} user={user} />}
            />
            <Route
              path="/mygames"
              element={
                <GameList games={joinedGames} user={user} joined={true} />
              }
            />
            <Route path="/account" element={<Account user={user} />} />
          </Routes>
          <Box
            sx={{ width: "100vw", position: "fixed", bottom: 0, opacity: 0.5 }}
          >
            <BottomNavigation showLabels>
              <BottomNavigationAction
                label="Upcoming"
                icon={<FormatListBulletedOutlinedIcon />}
                onClick={() => navigate("/gamelist")}
              />
              <BottomNavigationAction
                label="Organise"
                icon={<AddCircleOutlineOutlinedIcon />}
                onClick={() => navigate("/organise")}
              />
              <BottomNavigationAction
                label="Joined"
                icon={<FavoriteIcon />}
                onClick={() => navigate("/mygames")}
              />
              <BottomNavigationAction
                label="Account"
                icon={<AccountCircleOutlinedIcon />}
                onClick={() => navigate("/account")}
              />
            </BottomNavigation>
          </Box>
        </div>
      ) : (
        <div className="login-container">
          <SignIn logIn={logIn} />
        </div>
      )}
    </div>
  );
}

export default App;
