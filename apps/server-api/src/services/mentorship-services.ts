import { MentorshipRepository } from "../repositories/mentorship-repository";

export function createMentorshipService(repo: MentorshipRepository) {
    return {
        async requestMentorship(novatoId: string, padrinhoId: string, objetivo: string) {
            if (novatoId === padrinhoId) {
                throw new Error("Você não pode se apadrinhar");
            }
            if (objetivo.trim().length < 5) {
                throw new Error("Descreva melhor seu objetivo");
            }
            if (await repo.hasPendingRequest(novatoId, padrinhoId)) {
                throw new Error("Já existe uma solicitação pendente com esse padrinho");
            }
            return repo.create({ novatoId, padrinhoId, objetivo });
        },
        async respondToRequest(requestId: string, decision: "aceito" | "recusado") {
            const request = await repo.getById(requestId);
            if (!request) throw new Error("Solicitação não encontrada");
            if (request.status !== "pendente") {
                throw new Error("Essa solicitação já foi respondida");
            }
            return repo.updateStatus(requestId, decision);
        },
    };
}
