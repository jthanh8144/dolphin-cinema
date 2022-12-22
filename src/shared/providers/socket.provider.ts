import { socket } from '@shared/providers'

class SocketProvider {
  public init() {
    socket.on('connection', (sk) => {
      console.log('Socket connected')

      sk.on('disconnect', () => {
        console.log('Socket connected')
      })

      sk.on('selecting', (data) => {
        socket.emit('selecting', data)
      })

      sk.on('deselect', (data) => {
        socket.emit('deselect', data)
      })
    })
  }
}

export const socketProvider = new SocketProvider()
