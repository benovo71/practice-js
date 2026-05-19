import type { Contact, NewContact, ContactUpdateData } from "../types.js";
import { appState } from "../state.js";

export function loadContactsFromStorage() {
  const storedData = localStorage.getItem("contacts");
  if (!storedData) return;
  try {
    appState.contacts = JSON.parse(storedData) as Contact[];
  } catch {
    appState.contacts = [];
    localStorage.removeItem("contacts");
  }
}

export function saveContactsToStorage() {
  localStorage.setItem("contacts", JSON.stringify(appState.contacts));
}

export function findContactById(id: string): Contact | undefined {
  return appState.contacts.find((c) => c.id === id);
}

export function addContact(contact: NewContact & { id: string }) {
  appState.contacts.push(contact as Contact);
  saveContactsToStorage();
}

export function updateContact(id: string, updatedData: ContactUpdateData): boolean {
  const index = appState.contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    const currentContact = appState.contacts[index]!;
    appState.contacts[index] = { 
      id: currentContact.id,
      name: updatedData.name ?? currentContact.name,
      vacancy: updatedData.vacancy ?? currentContact.vacancy,
      phone: updatedData.phone ?? currentContact.phone,
    };
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function deleteContactById(id: string): boolean {
  const initialLength = appState.contacts.length;
  appState.contacts = appState.contacts.filter((c) => c.id !== id);
  if (appState.contacts.length !== initialLength) {
    saveContactsToStorage();
    return true;
  }
  return false;
}

export function clearAllContacts() {
  appState.contacts = [];
  saveContactsToStorage();
}
