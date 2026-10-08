import { createLocalStorage, createMemoryStore } from "./local-storage.mjs";

// Single switch point: swap in an API adapter with the same interface later.

function probeLocalStorage() {
    try {
        const key = "pitchdeck:probe";
        localStorage.setItem(key, key);
        localStorage.removeItem(key);
        return localStorage;
    } catch {
        return null;
    }
}

const store = probeLocalStorage();

export const isPersistent = store !== null;
export const storage = createLocalStorage(store ?? createMemoryStore());
