import API from './API'
import io from 'socket.io-client'

export default io(API.socketURL)