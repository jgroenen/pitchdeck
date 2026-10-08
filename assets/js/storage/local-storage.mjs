import { normalizeDeck } from "../deck.mjs";

const PREFIX = "pitchdeck:deck:";

// Storage adapter interface (all async, so a JSON storage API can implement the same):
//   list()       -> Promise<Deck[]>   newest first
//   get(id)      -> Promise<Deck|null>
//   save(deck)   -> Promise<Deck>     returns the stored deck with a fresh updatedAt
//   remove(id)   -> Promise<void>
//
// One key per deck, so each deck maps 1-to-1 onto a JSON document later on.
export function createLocalStorage(store) {
    const keyFor = id => PREFIX + id;

    function parse(json) {
        if (json === null) return null;
        try {
            return normalizeDeck(JSON.parse(json));
        } catch {
            return null;
        }
    }

    return {
        async list() {
            const decks = [];
            for (let i = 0; i < store.length; i++) {
                const key = store.key(i);
                if (!key?.startsWith(PREFIX)) continue;
                const deck = parse(store.getItem(key));
                if (deck) decks.push(deck);
            }
            return decks.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        },

        async get(id) {
            return parse(store.getItem(keyFor(id)));
        },

        async save(deck) {
            const saved = { ...deck, updatedAt: new Date().toISOString() };
            store.setItem(keyFor(deck.id), JSON.stringify(saved));
            return saved;
        },

        async remove(id) {
            store.removeItem(keyFor(id));
        }
    };
}

// Fallback when localStorage is blocked (private mode, disabled site data): works, but forgets on reload.
export function createMemoryStore() {
    const items = new Map();
    return {
        get length() { return items.size; },
        key: i => [...items.keys()][i] ?? null,
        getItem: key => items.get(key) ?? null,
        setItem: (key, value) => { items.set(key, String(value)); },
        removeItem: key => { items.delete(key); }
    };
}
