import { io } from 'socket.io-client';
export const socket = io('https://mindful-sparkle-production-f806.up.railway.app', { autoConnect: true })