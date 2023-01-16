export const setServerPinger = () => {
  setInterval(() => {
    fetch("https://personal-app-server.onrender.com")
  }, 15 * 60 * 1000)
}
