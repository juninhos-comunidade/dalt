import { MentorshipRequest, MentorshipStatus } from "@dalt/shared-types";

export interface MentorshipRepository {
    create(data: Omit<MentorshipRequest, "id" | "status" | "createdAt">): Promise<MentorshipRequest>;
    getById(id: string): Promise<MentorshipRequest | null>;
    updateStatus(id: string, status: MentorshipStatus): Promise<MentorshipRequest>;
    hasPendingRequest(novatoId: string, padrinhoId: string): Promise<boolean>;
}
