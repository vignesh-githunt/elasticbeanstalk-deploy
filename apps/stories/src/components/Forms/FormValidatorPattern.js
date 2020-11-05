export const email = {
  required: "Field is required",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "Field must be valid email",
  },
};
export const field = {
  required: "Field is required",
};
export const name = {
  required: "Name is required",
};
export const text = {
  required: "Text is required",
};
