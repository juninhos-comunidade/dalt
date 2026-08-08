import fastify from "fastify";
import { createMentorshipService } from "./services/mentorship-services";
import { inMemoryMentorshipRepository } from "./repositories/in-memory-mentorship-repository";
import { createProfileService } from "./services/profile-services";
import { inMemoryProfileRepository } from "./repositories/in-memory-profile-repository";

const app = fastify({ logger: true });

const mentorshipService = createMentorshipService(inMemoryMentorshipRepository);
const createProfile = createProfileService(inMemoryProfileRepository);

app.post('/mentorship/request', async (request, reply) => {
    const { novatoId, padrinhoId, objetivo } = request.body as any;
    try {
        const result = await mentorshipService.requestMentorship(novatoId, padrinhoId, objetivo);
        return reply.send({ success: true, data: result });
    } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
    }
});

app.post('/mentorship/respond', async (request, reply) => {
    const { requestId, decision } = request.body as any;
    try {
        const result = await mentorshipService.respondToRequest(requestId, decision);
        return reply.send({ success: true, data: result });
    } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
    }
});

app.post('/profile', async (request, reply) => {
    const { fullName, role } = request.body as any;
    try {
        const result = await createProfile(fullName, role);
        return reply.send({ success: true, data: result });
    } catch (error) {
        return reply.status(400).send({ success: false, error: (error as Error).message });
    }
});

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
