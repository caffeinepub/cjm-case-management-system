import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CaseRecord {
    caseNumber: string;
    name: string;
    createdAt: Time;
    forwardDate?: string;
    manualNote: string;
    crimeNumber?: string;
}
export type Time = bigint;
export interface backendInterface {
    addRecord(name: string, caseNumber: string, crimeNumber: string | null, forwardDate: string | null, manualNote: string): Promise<void>;
    getAllRecords(): Promise<Array<CaseRecord>>;
}
