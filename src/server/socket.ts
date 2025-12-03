import { Server } from 'socket.io'

let io: any | null = null

export function initSocket() {
  if (io) return io
  const port = Number(process.env.SOCKET_PORT || 4000)
  io = new Server(port, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  const nsp = io.of('/chat')
  nsp.on('connection', (socket: any) => {
    socket.on('user:join', (payload: any) => {
      socket.join(payload?.email_hash || '')
      nsp.emit('agent:online', { online: true })
    })
    socket.on('user:message', (payload: any) => {
      nsp.to(payload?.email_hash || '').emit('user:message', payload)
      socket.emit('message:delivered', { id: payload.id })
    })
    socket.on('admin:reply', (payload: any) => {
      nsp.to(payload?.email_hash || '').emit('admin:reply', payload)
    })
    socket.on('admin:typing', (payload: any) => {
      nsp.to(payload?.email_hash || '').emit('admin:typing', payload)
    })
  })

  return io
}

export function getIO() {
  return io || initSocket()
}
