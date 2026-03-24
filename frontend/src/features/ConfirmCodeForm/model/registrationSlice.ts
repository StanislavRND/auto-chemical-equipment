import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type RegistrationState = {
  user_type: "legal" | "person";
  inn: string;
  kpp: string;
  legal_name: string;
  legal_address: string;
  full_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
};

const initialState: RegistrationState = {
  user_type: "person",
  inn: "",
  kpp: "",
  legal_name: "",
  legal_address: "",
  full_name: "",
  phone: "",
  email: "",
  password: "",
  password_confirm: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof RegistrationState; value: string }>,
    ) => {
      if (action.payload.field === "user_type") {
        const v = action.payload.value as "legal" | "person";
        state.user_type = v;
      } else {
        state[action.payload.field] = action.payload.value;
      }
    },

    setFormData: (state, action: PayloadAction<RegistrationState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateField, setFormData } = registrationSlice.actions;
export default registrationSlice.reducer;
