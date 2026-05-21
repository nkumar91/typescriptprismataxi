import { Prisma } from "../../generated/prisma/client.js";

export type City = {
    id: bigint;
    name: string;
    state: string;
    country: string;
    is_active: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

export type CreateCityInput = {
    name: string;
    state: string;
    country?: string;
    is_active?: boolean;
};

export type UpdateCityInput = {
    name?: string;
    state?: string;
    country?: string;
    is_active?: boolean;
};

export type CityResponse = City;

export type CityParams = {
    id?: bigint;
};

export type Location = {
    id: bigint;
    city_id: bigint;
    name: string;
    address?: string | null;
    lat?: Prisma.Decimal | null;
    lng?: Prisma.Decimal | null;
    is_active: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

export type CreateLocationInput = {
    city_id: bigint;
    name: string;
    address?: string;
    lat?: Prisma.Decimal;
    lng?: Prisma.Decimal;
    is_active?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

export type UpdateLocationInput = {
    city_id?: bigint;
    name?: string;
    address?: string | null;
    lat?: Prisma.Decimal | null;
    lng?: Prisma.Decimal | null;
    is_active?: boolean;
};

export type LocationResponse = Location;

export type LocationParams = {
    id?: bigint;
};
