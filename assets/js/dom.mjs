// Tiny element builder. Children are appended as nodes or text, never parsed as HTML.
//   h("button", { className: "next", onclick: fn }, "Volgende")
export function h(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (value === null || value === undefined || value === false) continue;
        if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
        else if (key in el) el[key] = value;
        else el.setAttribute(key, value === true ? "" : value);
    }
    el.append(...children.flat().filter(child => child !== null && child !== undefined && child !== false));
    return el;
}

export function isEditable(el) {
    return el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable);
}
