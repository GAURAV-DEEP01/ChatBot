// src/types.ts

export interface ChatBlock_t {
    role: string;
    content: string;
}

export type Chats_t = ChatBlock_t[];

export type GeminiChatBlock_t = {
    parts: [
        {
            text: string;
        }
    ]
    role: string;
}

export type GeminiChats_t = GeminiChatBlock_t[];