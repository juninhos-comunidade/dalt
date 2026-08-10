import { Profile } from "@dalt/shared-types";

export interface ProfileRepository {
    create(data: Omit<Profile, "id">): Promise<Profile>;
    getById(id: string): Promise<Profile | null>;
}
