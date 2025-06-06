// src/utils/formatCurrency.js
export const formatCurrency = (value) => {
  const numValue = Number(value);
  if (isNaN(numValue)) return '₡0';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(numValue);
};