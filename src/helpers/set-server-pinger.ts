export const setServerPinger = () => {
  setInterval(() => {
    fetch("https://budgetello-backend.onrender.com")
  }, 10 * 60 * 1000)
}
