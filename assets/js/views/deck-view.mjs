import { h, isEditable } from "../dom.mjs";
import { deckName, hintFor } from "../deck.mjs";
import { createAutosaver } from "../autosave.mjs";

const SWIPE_MIN_DISTANCE = 60;

const STATUS_TEXT = {
    pending: "Wijzigingen…",
    saving: "Opslaan…",
    saved: "Opgeslagen",
    error: "Opslaan mislukt"
};

function autosize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function renderNotFound() {
    return {
        element: h("section", { className: "deck-list" },
            h("h1", {}, "Deck niet gevonden"),
            h("p", {}, "Dit deck staat niet (meer) in deze browser. ", h("a", { href: "#/" }, "Terug naar alle decks"), ".")
        ),
        mount() {},
        async dispose() {}
    };
}

export async function renderDeckView({ storage, deckId, slideNumber }) {
    const deck = await storage.get(deckId);
    if (!deck || !deck.slides.length) return renderNotFound();

    const total = deck.slides.length;
    let current = Math.min(Math.max(slideNumber - 1, 0), total - 1);

    const nameEl = h("span", { className: "deck-name" });
    const statusEl = h("span", { className: "save-status", role: "status" });
    const counterEl = h("span", { className: "slide-counter" });

    const saver = createAutosaver(storage, deck, state => {
        statusEl.textContent = STATUS_TEXT[state];
        statusEl.dataset.state = state;
    });

    function updateName() {
        nameEl.textContent = deckName(deck);
        document.title = `${deckName(deck)} – Pitchdeck Generator`;
    }

    function renderSlide(slide, index) {
        const hint = hintFor(index);
        const content = h("textarea", {
            className: "slide-content",
            value: slide.content,
            placeholder: hint.content,
            rows: 3,
            "aria-label": `Tekst van slide ${index + 1}`,
            oninput() {
                slide.content = content.value;
                autosize(content);
                saver.schedule();
            }
        });
        const title = h("input", {
            className: "slide-title",
            type: "text",
            value: slide.title,
            placeholder: hint.title,
            "aria-label": `Titel van slide ${index + 1}`,
            oninput() {
                slide.title = title.value;
                if (index === 0) updateName();
                saver.schedule();
            },
            onkeydown(e) {
                if (e.key !== "Enter") return;
                e.preventDefault();
                content.focus();
            }
        });
        return h("section", { className: "slide", hidden: true }, title, content);
    }

    const slideEls = deck.slides.map(renderSlide);

    function show(index) {
        slideEls[current].hidden = true;
        current = (index + total) % total;
        slideEls[current].hidden = false;
        autosize(slideEls[current].querySelector("textarea"));
        counterEl.textContent = `slide ${current + 1} van ${total}`;
        history.replaceState(null, "", `#/deck/${encodeURIComponent(deck.id)}/${current + 1}`);
    }

    const slidesEl = h("div", { className: "slides" }, slideEls);

    const element = h("section", { className: "deck" },
        h("header", { className: "topbar" },
            h("a", { className: "back", href: "#/" }, "← Alle decks"),
            nameEl,
            statusEl
        ),
        slidesEl,
        h("nav", { className: "pager", "aria-label": "Slides" },
            h("button", { className: "button", type: "button", onclick: () => show(current - 1) }, "← Vorige"),
            counterEl,
            h("button", { className: "button", type: "button", onclick: () => show(current + 1) }, "Volgende →")
        )
    );

    function onKeydown(e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (isEditable(e.target)) {
            if (e.key === "Escape") e.target.blur();
            return;
        }
        switch (e.key) {
            case "ArrowLeft": case "ArrowUp": case "PageUp":
                show(current - 1);
                break;
            case "ArrowRight": case "ArrowDown": case "PageDown":
                show(current + 1);
                break;
            case " ":
                if (e.target.closest?.("button, a")) return;
                show(current + 1);
                break;
            case "Home":
                show(0);
                break;
            case "End":
                show(total - 1);
                break;
            default:
                return;
        }
        e.preventDefault();
    }

    let touchStart = null;

    function onTouchStart(e) {
        touchStart = e.touches.length === 1 && !isEditable(document.activeElement)
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : null;
    }

    function onTouchEnd(e) {
        if (!touchStart) return;
        const dx = e.changedTouches[0].clientX - touchStart.x;
        const dy = e.changedTouches[0].clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
        show(current + (dx < 0 ? 1 : -1));
    }

    function onVisibilityChange() {
        if (document.visibilityState === "hidden") saver.flush();
    }

    function onPageHide() {
        saver.flush();
    }

    return {
        element,
        mount() {
            updateName();
            show(current);
            window.addEventListener("keydown", onKeydown);
            window.addEventListener("pagehide", onPageHide);
            document.addEventListener("visibilitychange", onVisibilityChange);
            slidesEl.addEventListener("touchstart", onTouchStart, { passive: true });
            slidesEl.addEventListener("touchend", onTouchEnd, { passive: true });
        },
        async dispose() {
            window.removeEventListener("keydown", onKeydown);
            window.removeEventListener("pagehide", onPageHide);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            await saver.flush();
        }
    };
}
