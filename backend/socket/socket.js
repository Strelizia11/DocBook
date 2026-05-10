const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join', (userId) => {
      socket.join(userId)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}

export const sendNotification = (io, userId, message) => {
  io.to(userId).emit('notification', { message })
}

export default initSocket
