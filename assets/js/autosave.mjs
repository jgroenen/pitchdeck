// Debounced saving of one deck. Saves are chained so they never overlap,
// which matters once storage is a network API instead of localStorage.
//   onState receives: "pending" | "saving" | "saved" | "error"
export function createAutosaver(storage, deck, onState, delay = 400) {
    let timer = null;
    let saving = Promise.resolve();

    function schedule() {
        clearTimeout(timer);
        onState("pending");
        timer = setTimeout(flush, delay);
    }

    function flush() {
        if (timer === null) return saving;
        clearTimeout(timer);
        timer = null;
        onState("saving");
        saving = saving
            .then(() => storage.save(deck))
            .then(
                saved => {
                    deck.updatedAt = saved.updatedAt;
                    onState("saved");
                },
                err => {
                    console.error("Opslaan mislukt", err);
                    onState("error");
                }
            );
        return saving;
    }

    return { schedule, flush };
}
