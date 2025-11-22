export const formatPhoneNumber = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateRandomId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};