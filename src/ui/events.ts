import type { Contact } from "../types.js";
import { appState } from "../state.js";
import {
  renderAlphabetIndex,
  renderContacts,
  renderSearchResults,
} from "./renderer.js";

import {
  openEditModal,
  closeEditModal,
  openSearchModal,
  closeSearchModal,
} from "./modals.js";

import {
  handleAddContact,
  handleEditContact,
  handleDeleteContact,
  handleClearAllContacts,
} from "../forms/index.js";

export function setupEventListeners() {
  // Формы
  document
    .querySelector("#contactForm")
    ?.addEventListener("submit", handleAddContact);
  document
    .querySelector("#editForm")
    ?.addEventListener("submit", handleEditContact);

  // Кнопки
  document
    .querySelector("#clearBtn")
    ?.addEventListener("click", handleClearAllContacts);
  document
    .querySelector("#searchBtn")
    ?.addEventListener("click", openSearchModal);

  document
    .querySelector('#editModal button[type="button"]')
    ?.addEventListener("click", closeEditModal);

  // Поиск
  document.querySelector("#searchInput")?.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase().trim();
    if (!query) {
      renderSearchResults([]);
      return;
    }
    const results = appState.contacts.filter(
      (c: Contact) =>
        c.name.toLowerCase().includes(query) ||
        c.vacancy.toLowerCase().includes(query),
    );
    renderSearchResults(results);
  });

  // Алфавит
  document.querySelector("#alphabet")?.addEventListener("click", (e: Event) => {
    const el = (e.target as HTMLElement).closest("[data-letter]");
    if (!el) return;
    const letter = (el as HTMLElement).dataset.letter;
    if (!letter) return;
    appState.filteredContacts = appState.contacts.filter((c: Contact) =>
      c.name.toUpperCase().startsWith(letter.toUpperCase()),
    );
    renderContacts(appState.filteredContacts);
  });

  // Список контактов
  document.querySelector("#contactsList")?.addEventListener("click", (e: Event) => {
    const btn = (e.target as HTMLElement).closest("[data-action]");
    if (!btn) return;
    const item = (btn as HTMLElement).closest("[data-id]");
    if (!item) return;
    const id = (item as HTMLElement).dataset.id;
    const action = (btn as HTMLElement).dataset.action;

    if (action === "edit" && id) openEditModal(id);
    else if (action === "delete" && id) handleDeleteContact(id);
  });

  // Результаты поиска
  document.querySelector("#searchResults")?.addEventListener("click", (e: Event) => {
    const btn = (e.target as HTMLElement).closest("[data-action]");
    if (!btn) return;
    const item = (btn as HTMLElement).closest("[data-id]");
    if (!item) return;
    const id = (item as HTMLElement).dataset.id;
    const action = (btn as HTMLElement).dataset.action;

    if (action === "edit" && id) {
      closeSearchModal();
      openEditModal(id);
    } else if (action === "delete" && id) {
      handleDeleteContact(id);
      const searchInput = document.querySelector("#searchInput") as HTMLInputElement | null;
      const query = searchInput?.value || "";
      const results = appState.contacts.filter(
        (c: Contact) =>
          c.name.toLowerCase().includes(query) ||
          c.vacancy.toLowerCase().includes(query),
      );
      renderSearchResults(results);
    }
  });

  // Закрытие по клику вне модалки (на затемнение)
  window.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    // Проверяем, что клик был именно по фону модалки
    if (target.id === "editModal") closeEditModal();
    if (target.id === "searchModal") closeSearchModal();
  });
}
