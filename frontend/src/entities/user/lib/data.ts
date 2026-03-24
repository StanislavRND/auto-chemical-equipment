export const LEGAL_FIELDS = [
  { placeholder: "ИНН", key: "inn" },
  { placeholder: "КПП", key: "kpp" },
  { placeholder: "Юридическое наименование", key: "legal_name" },
  { placeholder: "Юридический адрес", key: "legal_address" },
  { placeholder: "E-mail", key: "email" },
] as const;

export const PERSON_FIELDS = [
  { placeholder: "ФИО", key: "full_name" },
  { placeholder: "Телефон", key: "phone" },
  { placeholder: "E-mail", key: "email" },
] as const;
