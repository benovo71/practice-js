// Основной тип контакта
export interface Contact {
  id: string;
  name: string;
  vacancy: string;
  phone: string;
}

// Тип состояния приложения
export interface AppState {
  contacts: Contact[];
  editingId: string | null;
  filteredContacts: Contact[] | null;
}

// Тип данных для обновления контакта (все поля необязательны)
export interface ContactUpdateData {
  name?: string;
  vacancy?: string;
  phone?: string;
}

// Тип для нового контакта (без id, он генерируется)
export interface NewContact {
  name: string;
  vacancy: string;
  phone: string;
}
