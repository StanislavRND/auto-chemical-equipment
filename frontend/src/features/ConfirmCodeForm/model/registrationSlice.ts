import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RegistrationData {
  inn: string;
  kpp: string;
  legal_address: string;
  email: string;
  password: string;
  password_confirm: string;
}

const initialState: RegistrationData = {
  inn: "",
  kpp: "",
  legal_address: "",
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
      action: PayloadAction<{ field: keyof RegistrationData; value: string }>,
    ) => {
      state[action.payload.field] = action.payload.value;
    },

    setFormData: (state, action: PayloadAction<RegistrationData>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateField, setFormData, } =
  registrationSlice.actions;
export default registrationSlice.reducer;
