import { h } from "../dom.mjs";
import { createDeck, deckName, progress } from "../deck.mjs";

const dateFormat = new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" });

function formatDate(iso) {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? "onbekend" : dateFormat.format(date);
}

// Views return { element, mount(), dispose() }; the router mounts the element.
export async function renderDeckList({ storage, isPersistent, refresh }) {
    const decks = await storage.list();

    async function newDeck() {
        const deck = await storage.save(createDeck());
        location.hash = `#/deck/${encodeURIComponent(deck.id)}/1`;
    }

    async function removeDeck(deck) {
        if (!confirm(`"${deckName(deck)}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
        await storage.remove(deck.id);
        refresh();
    }

    function renderItem(deck) {
        const { filled, total } = progress(deck);
        return h("li", { className: "deck-item" },
            h("a", { className: "deck-link", href: `#/deck/${encodeURIComponent(deck.id)}/1` },
                h("span", { className: "deck-item-name" }, deckName(deck)),
                h("span", { className: "deck-item-meta" },
                    `${filled} van ${total} slides ingevuld · bijgewerkt ${formatDate(deck.updatedAt)}`)
            ),
            h("button", { className: "button button-quiet", type: "button", onclick: () => removeDeck(deck) }, "Verwijderen")
        );
    }

    const element = h("section", { className: "deck-list" },
        h("header", { className: "deck-list-header" },
            h("h1", {}, "Pitchdeck Generator"),
            h("p", {},
                "Schrijf je pitch in de ",
                h("a", { href: "https://guykawasaki.com/the-only-10-slides-you-need-in-your-pitch/", target: "_blank", rel: "noopener" },
                    "10 slides van Guy Kawasaki"),
                ". Alles wordt automatisch in deze browser opgeslagen."
            )
        ),
        isPersistent ? null : h("p", { className: "notice" },
            "Deze browser staat lokaal opslaan niet toe. Je werk verdwijnt als je de pagina sluit."),
        h("button", { className: "button button-primary", type: "button", onclick: newDeck }, "+ Nieuw deck"),
        decks.length
            ? h("ul", { className: "decks" }, decks.map(renderItem))
            : h("p", { className: "empty" }, "Nog geen decks. Begin met een nieuw deck.")
    );

    return {
        element,
        mount() {
            document.title = "Pitchdeck Generator";
        },
        async dispose() {}
    };
}
