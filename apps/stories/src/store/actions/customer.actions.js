export const SET_CUSTOMER = "SET_CUSTOMER";
export const REMOVE_CUSTOMER = "REMOVE_CUSTOMER";

/**
 * Change current customer
 */
export function setCustomer(customerId, customerName) {
  return { type: SET_CUSTOMER, customerId, customerName };
}

export const removeCustomer = () => {
  return { type: REMOVE_CUSTOMER };
};
