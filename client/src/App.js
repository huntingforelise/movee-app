import "./App.css";
import SignIn from "./components/SignIn";
import GameList from "./components/GameList";
import AddGame from "./components/AddGame";
import * as ApiClient from "./ApiClientService";
import { postUser } from "./ApiClientService";
import { useState, useEffect } from "react";
import image from "./assets/image.jpg";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [games, setGames] = useState([]);

  function logIn(user) {
    const output = postUser(user);
    if (output) setLoggedIn(true);
  }

  useEffect(() => {
    ApiClient.getGames()
      .then((games) => setGames(games))
      .catch((error) => console.log(error));
  }, []);

  function postGame(data) {
    ApiClient.postGame({
      date: data.date,
      beach: data.beach,
      maxplayers: data.maxplayers,
      level: data.level,
    })
      .then((newGame) => {
        setGames([...games, newGame]);
      })
      .catch((error) => console.log(error));
  }

  function joinGame(fullGameObject) {
    ApiClient.joinGame(fullGameObject)
      .then((updatedGame) => {
        const newGames = [...games];
        for (const newGame of newGames) {
          if (newGame._id === updatedGame._id) {
            const updatedPlayers = updatedGame.subscribedplayers;
            newGame.subscribedplayers = updatedPlayers;
          }
        }
        setGames(newGames);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="App">
      <img src={image} alt="bola-logo" width={50} height={50} />
      <h1>Bola</h1>
      {loggedIn ? (
        <>
          <div className="list-container">
            <GameList games={games} joinGame={joinGame} />
          </div>
          <div className="add-container">
            <AddGame postGame={postGame} />
          </div>
        </>
      ) : (
        <div className="login-container">
          <SignIn logIn={logIn} />
        </div>
      )}
    </div>
  );
}

export default App;

// return (
//   <div className="App">
//     <div className="list-container">
//       <GameList games={games} joinGame={joinGame} />
//     </div>
//     <div className="add-container">
//       <AddGame postGame={postGame} />
//     </div>
//     <div className="login-container">
//       <SignIn />
//     </div>
//   </div>
// );
