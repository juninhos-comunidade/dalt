import { ProfileRepository } from "../repositories/profile-repository";
import { Profile } from "../types";

export function createProfileService(repo: ProfileRepository) {
    return async function createProfile(fullName: string, role: "novato" | "padrinho") {
        if (fullName.trim().length < 2) {
            throw new Error("Nome curto");
        }
        return repo.create({ fullName, role });
    };
}
