import { io } from "socket.io-client"

const socket = io(process.env.REACT_APP_SOCKET_HOST, {
  reconnectionDelayMax: 10000
})
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
socket.on("disconnect", () => {
  console.log(socket.id); // undefined
});
const sendMessage = ({ data }) => {
  socket.emit("sendMessage", data)
}
export { socket, sendMessage };