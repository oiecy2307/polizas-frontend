export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user;
  } catch (e) {
    return null;
  }
};

export const getToken = () => {
  try {
    const token = localStorage.getItem('token');
    return token;
  } catch (e) {
    return null;
  }
};

export const mediaQuery = '@media (max-width: 768px)';
export const createUrlForSrc = (imgSrc, format, size) => {
  const blob = new Blob([imgSrc], { type: getBlobType(format) });
  const urlCreator = window.URL || window.webkitURL;
  let snackbar = {
    open: false,
    text: '',
  };
  if (
    format !== 'pdf' &&
    format !== 'png' &&
    format !== 'jpeg' &&
    format !== 'jpg'
  ) {
    snackbar = {
      open: true,
      text: 'El formato del archivo no es válido',
    };
  }
  if (size > 5000000) {
    snackbar = {
      open: true,
      text: 'El tamaño del archivo debe ser menor a 5MB',
    };
  }
  const node = {
    imageUrl: snackbar.open ? '' : urlCreator.createObjectURL(blob),
    snackbar,
  };
  return node;
};

export const textRegex = /^[a-zA-ZáÁéÉíÍóÓúÚñÑ ]+$/;

export const alphanumeric = /^[a-zA-ZáÁéÉíÍóÓúÚñÑ 0-9]+$/;

export const americanExpressRegex = /^3[47][0-9]{5,}$/;

export const toPhone = inputOriginal => {
  let input = inputOriginal.replace(/\D/g, '');
  input = input.substring(0, 10);
  const sizePhone = input.length;
  if (sizePhone === 0) {
    input = '';
  } else if (sizePhone < 4) {
    input = `(${input}`;
  } else if (sizePhone < 7) {
    input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}`;
  } else {
    input = `(${input.substring(0, 3)}) ${input.substring(
      3,
      6,
    )} - ${input.substring(6, 10)}`;
  }
  return input;
};

export const creditcardType = value => {
  let typeCreditCard = '';
  if (value) {
    const visaReggex = /^4[0-9]{6,}$/;
    const masterReggex = /^5[1-5][0-9]{5,}|222[1-9][0-9]{3,}|22[3-9][0-9]{4,}|2[3-6][0-9]{5,}|27[01][0-9]{4,}|2720[0-9]{3,}$/;
    const americanRegex = /^3[47][0-9]{5,}$/;
    if (americanRegex.test(value)) {
      typeCreditCard = 'american-express';
      return typeCreditCard;
    }
    if (visaReggex.test(value)) {
      typeCreditCard = 'visa';
      return typeCreditCard;
    }
    if (masterReggex.test(value)) {
      typeCreditCard = 'mastercard';
      return typeCreditCard;
    }
  }
  return typeCreditCard;
};

export const validateUrl = value =>
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value,
  );
