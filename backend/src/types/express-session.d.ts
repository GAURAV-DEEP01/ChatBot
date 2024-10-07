import { Session } from "express-session"
import { Chats_t, GeminiChatBlock_t, GeminiChats_t } from "./chats"

export interface ISession extends Session {
    userChat: Chats_t;
    userGeminiChat: GeminiChats_t;
}   