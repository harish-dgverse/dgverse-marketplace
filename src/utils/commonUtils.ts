/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
export {};

export const removeEmptyValues = (payload: any) => {
  return Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => {
      if (v === null || v === undefined || v === '') return false;
      if (typeof v === 'object' && Object.keys(v).length === 0) return false;
      return true;
    })
  );
};

export const isCypressTesting = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const testing = urlParams.get('testing-e2e');
  return !!testing;
};
