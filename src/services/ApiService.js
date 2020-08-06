import axios from "axios";

var urlBase = "https://new-battleship-api.herokuapp.com/";

if (process.env.NODE_ENV === "development") urlBase = "http://localhost:3001";

const api = axios.create({
  baseURL: urlBase,
});

const ApiService = {
  login: async (creds) =>
    await api.post("auth", creds).catch((err) => err.response),
  createUser: async (user) =>
    await api.post("players", user).catch((err) => err.response),
  getPlayer: async (playerId, token) =>
    await api
      .get(`players/${playerId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((err) => err.response),
  getShips: async (token) =>
    await api
      .get("ships", {
        headers: { Authorization: "Bearer " + token },
      })
      .catch((err) => err.response),
};

export default ApiService;
