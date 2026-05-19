import { appState } from "../state.js";
import { findContactById } from "../storage/index.js";

type CleanupFn = () => void;

// Вспомогательная функция: ловушка фокуса
function setupFocusTrap(modal: HTMLElement, onCloseCallback: () => void): CleanupFn {
  const focusable = modal.querySelectorAll(
    'input, button, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0] as HTMLElement | undefined;
  const last = focusable[focusable.length - 1] as HTMLElement | undefined;
  const lastFocused = document.activeElement as HTMLElement | null;

  first?.focus();

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onCloseCallback();
      return;
    }
    if (e.key !== "Tab") return;

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  }

  modal.addEventListener("keydown", onKey);

  // Возвращаем функцию очистки (чтобы убрать слушатель при закрытии)
  return () => {
    modal.removeEventListener("keydown", onKey);
    lastFocused?.focus();
  };
}

// --- ЭКСПОРТИРУЕМЫЕ ФУНКЦИИ ---

export function openEditModal(id: string): CleanupFn | undefined {
  const contact = findContactById(id);
  if (!contact) return;

  appState.editingId = id;
  const nameInput = document.querySelector("#editName") as HTMLInputElement;
  const vacancyInput = document.querySelector("#editVacancy") as HTMLInputElement;
  const phoneInput = document.querySelector("#editPhone") as HTMLInputElement;
  
  if (nameInput) nameInput.value = contact.name;
  if (vacancyInput) vacancyInput.value = contact.vacancy;
  if (phoneInput) phoneInput.value = contact.phone;

  const modal = document.querySelector("#editModal");
  if (!modal) return;

  modal.classList.add("modal--visible");
  (modal as HTMLElement).hidden = false;

  // Запускаем ловушку фокуса, передавая ссылку на closeEditModal
  return setupFocusTrap(modal as HTMLElement, closeEditModal);
}

export function closeEditModal() {
  const modal = document.querySelector("#editModal");
  if (!modal) return;

  modal.classList.remove("modal--visible");
  (modal as HTMLElement).hidden = true;
  appState.editingId = null;
  const form = document.querySelector("#editForm") as HTMLFormElement | null;
  form?.reset();
}

export function openSearchModal(): CleanupFn | undefined {
  const modal = document.querySelector("#searchModal");
  if (!modal) return;

  modal.classList.add("modal--visible");
  (modal as HTMLElement).hidden = false;
  const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
  const searchResults = document.querySelector("#searchResults");
  if (searchInput) searchInput.value = "";
  if (searchResults) searchResults.innerHTML = "";
  searchInput?.focus();

  return setupFocusTrap(modal as HTMLElement, closeSearchModal);
}

export function closeSearchModal() {
  const modal = document.querySelector("#searchModal");
  if (!modal) return;

  modal.classList.remove("modal--visible");
  (modal as HTMLElement).hidden = true;
}
