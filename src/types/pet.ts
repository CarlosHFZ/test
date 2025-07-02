import { Colors } from "./colors";
import { Enterprise } from "./enterprise";
import { UUID } from "./types";

export enum PetSex {
  MALE = 'Macho',
  FEMALE = 'Fêmea',
}

interface PetBase {
  name: string;
  sex: PetSex;
  birth_date?: string;
  weight?: number;
  sterilization?: boolean;
  observation?: string;
  tagName?: string;
  tagColor?: Colors;
}
export interface CreatePetDto extends PetBase {
  tutorId: UUID;
  speciesId: number;
  raceId: number;
  coatId: number;
  isActivate?: boolean;
}



export interface Pet extends PetBase {
    id: UUID;
    created_at: string;
    isActivate: boolean;

    filesUrls: string[];

    tutor: {
        id: UUID;
        full_name: string;
    };
    species: {
        id: number;
        name: string;
    };
    race: {
        id: number;
        name: string;
    };
    coat: {
        id: number;
        name: string;
    };
}



export interface Species {
  id: number;
  name: string;
  enterprise: Enterprise | null;
}
export interface Coats {
  id: number;
  name: string;
  enterprise: Enterprise | null;
}

export interface Races {
  id: number;
  name: string;
  specie: Species | null;
  enterprise: Enterprise | null;
}
export interface CreateSpecieDto {
  name: string;
}

export interface CreateSpecieDto {
  name: string;
}

export interface CreateCoatDto {
  name: string;
}

export interface CreateRaceDto {
  name: string;
  species: number;
}
