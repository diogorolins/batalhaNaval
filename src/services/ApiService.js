import axios from "axios";

var urlBase = "https://new-battleship-backend.herokuapp.com/";

if (process.env.NODE_ENV === "development") urlBase = "http://localhost:8080";

const api = axios.create({
  baseURL: urlBase,
});

const ApiService = {
  login: async (creds) =>
    await api.post("auth", creds).catch((err) => err.response),
  createUser: async (user) =>
    await api.post("players", user).catch((err) => err.response),
  getPlayer: async (playerEmail, token) =>
    await api
      .get(`players/email/?email=${playerEmail}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((err) => err.response),
  getShips: async (token) =>
    await api
      .get("ships/types", {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((err) => err.response),
  createGame: async (game, token) =>
    await api.post("games", game, {
      headers: { Authorization: "Bearer " + token },
    }),
  getGame: async (gameId, token) =>
    await api.get(`games/${gameId}`, {
      headers: { Authorization: "Bearer " + token },
    }),
  setWinner: async (gameId, playerId, token) =>
    await api.put(
      `games/${gameId}`,
      { playerId },
      {
        headers: { Authorization: "Bearer " + token },
      }
    ),
};

export default ApiService;
