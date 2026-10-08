import { h } from "./dom.mjs";
import { storage, isPersistent } from "./storage/index.mjs";
import { renderDeckList } from "./views/deck-list.mjs";
import { renderDeckView } from "./views/deck-view.mjs";

// Hash routes (no server rewrites needed, so it runs on GitHub Pages):
//   #/                    all decks
//   #/deck/<id>/<slide>   edit a deck

const root = document.getElementById("app");
let disposeCurrent = null;
let routeId = 0;

function parseRoute(hash) {
    const [name, id, slide] = hash.replace(/^#\/?/, "").split("/");
    if (name === "deck" && id) {
        return { view: "deck", deckId: decodeURIComponent(id), slideNumber: Number.parseInt(slide, 10) || 1 };
    }
    return { view: "list" };
}

async function route() {
    const id = ++routeId;
    const dispose = disposeCurrent;
    disposeCurrent = null;
    await dispose?.(); // flushes pending saves before the next view reads storage
    if (id !== routeId) return;

    const target = parseRoute(location.hash);
    try {
        const view = target.view === "deck"
            ? await renderDeckView({ storage, ...target })
            : await renderDeckList({ storage, isPersistent, refresh: route });
        if (id !== routeId) {
            await view.dispose();
            return;
        }
        root.replaceChildren(view.element);
        view.mount();
        window.scrollTo(0, 0);
        disposeCurrent = () => view.dispose();
    } catch (err) {
        console.error(err);
        root.replaceChildren(h("section", { className: "deck-list" },
            h("h1", {}, "Er ging iets mis"),
            h("p", {}, String(err?.message ?? err), " ", h("a", { href: "#/" }, "Terug naar alle decks"), ".")
        ));
    }
}

window.addEventListener("hashchange", route);
route();
