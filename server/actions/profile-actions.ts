"use server";

import { createProfileService } from "../services/profile-service";
import { inMemoryProfileRepository } from "../repositories/in-memory-profile-repository";

const createProfile = createProfileService(inMemoryProfileRepository);

export async function createProfileAction(fullName: string, role: "novato" | "padrinho") {
    try {
        const profile = await createProfile(fullName, role);
        return { success: true, profile };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
