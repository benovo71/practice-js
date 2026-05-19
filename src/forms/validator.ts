function showError(el: HTMLElement | null, message: string) {
  if (!el) return;
  el.textContent = message;
  setTimeout(() => {
    if (el.textContent === message) el.textContent = "";
  }, 1500);
}

export function validateForm(nameId: string, vacancyId: string, phoneId: string): boolean {
  const nameInput = document.getElementById(nameId) as HTMLInputElement | null;
  const vacancyInput = document.getElementById(vacancyId) as HTMLInputElement | null;
  const phoneInput = document.getElementById(phoneId) as HTMLInputElement | null;

  const nameErr = document.getElementById(`${nameId}-error`);
  const vacancyErr = document.getElementById(`${vacancyId}-error`);
  const phoneErr = document.getElementById(`${phoneId}-error`);

  [nameErr, vacancyErr, phoneErr].forEach((el) => {
    if (el) el.textContent = "";
  });

  const name = nameInput?.value.trim() || "";
  const vacancy = vacancyInput?.value.trim() || "";
  const phone = phoneInput?.value.trim() || "";

  let valid = true;

  if (!name) {
    showError(nameErr, "Name is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(name)) {
    showError(nameErr, "Invalid characters in name");
    valid = false;
  }

  if (!vacancy) {
    showError(vacancyErr, "Vacancy is required");
    valid = false;
  } else if (!/^[a-zA-Zа-яА-Я\s'\-\.]+$/.test(vacancy)) {
    showError(vacancyErr, "Only letters and spaces");
    valid = false;
  }

  if (!phone) {
    showError(phoneErr, "Phone is required");
    valid = false;
  } else if (!/^[\+\d\s\-\(\)]{10,}$/.test(phone)) {
    showError(phoneErr, "Incorrect format of phone number");
    valid = false;
  }

  return valid;
}
