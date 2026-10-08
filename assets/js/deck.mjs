import { DEFAULT_SLIDES } from "./defaults.mjs";

// Deck shape, as stored:
// { id, createdAt, updatedAt, slides: [{ title, content }] }

export function createId() {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function createDeck() {
    const now = new Date().toISOString();
    return {
        id: createId(),
        createdAt: now,
        updatedAt: now,
        slides: DEFAULT_SLIDES.map(() => ({ title: "", content: "" }))
    };
}

// Validates and cleans up whatever comes out of storage; returns null when unusable.
export function normalizeDeck(raw) {
    if (!raw || typeof raw.id !== "string" || !Array.isArray(raw.slides)) return null;
    return {
        id: raw.id,
        createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
        updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
        slides: raw.slides.map(slide => ({
            title: String(slide?.title ?? ""),
            content: String(slide?.content ?? "")
        }))
    };
}

export function hintFor(index) {
    return DEFAULT_SLIDES[index] ?? { title: "", content: "" };
}

export function deckName(deck) {
    return deck.slides[0]?.title.trim() || "Naamloos deck";
}

export function progress(deck) {
    const filled = deck.slides.filter(slide => slide.content.trim()).length;
    return { filled, total: deck.slides.length };
}
