import { randomUID } from "crypto";
import { Profile } from "../types";
import { ProfileRepository } from "./profile-repository";

const db: Profile[] = [];

export const inMemoryProfileRepository: ProfileRepository = {
    async create(data) {
        const profile: Profile = { id: randomUID(), ...data };
        db.push(profile);
        return profile;
    },
    async getById(id) {
        return db.find((p) => p.id === id) ?? null;
    },
};
