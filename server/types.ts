export type Role = "novato" | "padrinho";
export type MentorshipStatus = "pendente" | "aceito" | "recusado" | "concluido";

export interface Profile {
    id: string;
    fullName: string;
    role: string;
    bio?: string;
    avatarUrl?: string;
}

export interface MentorshipRequest {
    id: string;
    novatoId: string;
    parinhoId: string;
    objetivo: string;
    status: MentorshipStatus;
    createdAt: Date;
}
