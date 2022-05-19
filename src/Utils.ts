const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');
const limitLength = (string = '', maxLength: number) =>
  string.slice(0, maxLength);

export const formatCardNumber = (number: string, card: any) => {
  const numberSanitized = removeNonNumber(number);
  const maxLength = card.lengths[card.lengths.length - 1];
  const lengthSanitized = limitLength(numberSanitized, maxLength);
  const offsets = [0].concat(card.gaps).concat([lengthSanitized.length]);

  return offsets
    .map((end, index) => {
      if (index === 0) return '';
      const start = offsets[index - 1];
      return lengthSanitized.slice(start, end);
    })
    .filter((part) => part !== '')
    .join(' ');
};

export const formatCardExpiry = (expiry: string) => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
  }
  return sanitized;
};

export const formatCardCVC = (cvc: string, card: any) => {
  const maxCVCLength = card.code.size;
  return limitLength(removeNonNumber(cvc), maxCVCLength);
};

const MAX_LENGTH = 255;

export const isValidCardholderName = (value: string) => {
  if (value.trim().length === 0) {
    return false;
  }
  if (value.trim().length > MAX_LENGTH) {
    return false;
  }
  return true;
};
