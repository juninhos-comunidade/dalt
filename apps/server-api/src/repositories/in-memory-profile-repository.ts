import { randomUUID } from "crypto";
import { Profile } from "@dalt/shared-types";
import { ProfileRepository } from "./profile-repository";

const db: Profile[] = [];

export const inMemoryProfileRepository: ProfileRepository = {
    async create(data) {
        const profile: Profile = { id: randomUUID(), ...data };
        db.push(profile);
        return profile;
    },
    async getById(id) {
        return db.find((p) => p.id === id) ?? null;
    },
};
