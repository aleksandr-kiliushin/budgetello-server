export const setServerPinger = () => {
  setInterval(() => {
    fetch("https://personal-app-backend.onrender.com")
  }, 10 * 60 * 1000)
}
