export type UserField = {
  key: string;
  placeholder: string;
};

export const LEGAL_FIELDS: UserField[] = [
  { placeholder: "ИНН", key: "inn" },
  { placeholder: "КПП", key: "kpp" },
  { placeholder: "Юридическое наименование", key: "legal_name" },
  { placeholder: "Юридический адрес", key: "legal_address" },
  { placeholder: "E-mail", key: "email" },
];

export const PERSON_FIELDS: UserField[] = [
  { placeholder: "ФИО", key: "full_name" },
  { placeholder: "Телефон", key: "phone" },
  { placeholder: "E-mail", key: "email" },
];