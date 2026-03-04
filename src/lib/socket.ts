import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinConversation(conversationId: string) {
        this.socket?.emit('join_conversation', conversationId);
    }

    leaveConversation(conversationId: string) {
        this.socket?.emit('leave_conversation', conversationId);
    }

    sendTyping(conversationId: string, isTyping: boolean) {
        this.socket?.emit('typing', { conversationId, isTyping });
    }

    onNewMessage(callback: (message: any) => void) {
        this.socket?.on('new_message', callback);
    }

    onNewConversationMessage(callback: (data: any) => void) {
        this.socket?.on('new_conversation_message', callback);
    }

    onUserTyping(callback: (data: any) => void) {
        this.socket?.on('user_typing', callback);
    }

    onMessagesRead(callback: () => void) {
        this.socket?.on('messages_read', callback);
    }

    off(event: string, callback?: any) {
        this.socket?.off(event, callback);
    }

    getSocket() {
        return this.socket;
    }
}

export const socketService = new SocketService();
