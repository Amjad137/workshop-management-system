import * as yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    noSpecialChars(message?: string): StringSchema;
    onlyLetters(message?: string): StringSchema;
    onlyNumbers(message?: string): StringSchema;
    onlyAlphaNumeric(message?: string): StringSchema;
    noNumbers(message?: string): StringSchema;
    noWhitespace(message?: string): StringSchema;
    startsWithLetter(message?: string): StringSchema;
    isMongoId(message?: string): StringSchema;
  }
}

// Disallow special characters (allow letters, space, apostrophe, hyphen)
yup.addMethod(
  yup.string,
  'noSpecialChars',
  function (message = 'Special characters are not allowed') {
    return this.matches(/^[a-zA-Z\s\d'.,:/()]*$/, message);
  },
);

// Allow only letters and spaces
yup.addMethod(yup.string, 'onlyLetters', function (message = 'Only letters are allowed') {
  return this.matches(/^[a-zA-Z\s]+$/, message);
});

// Allow only digits (0-9)
yup.addMethod(yup.string, 'onlyNumbers', function (message = 'Only numbers are allowed') {
  return this.matches(/^\d+$/, message);
});

// Allow only alphanumeric characters (letters and digits)
yup.addMethod(
  yup.string,
  'onlyAlphaNumeric',
  function (message = 'Only letters and numbers are allowed') {
    return this.matches(/^[a-zA-Z\d]+$/, message);
  },
);

// Disallow any digits
yup.addMethod(yup.string, 'noNumbers', function (message = 'Numbers are not allowed') {
  return this.matches(/^[^\d]+$/, message); // Same as /^[^0-9]+$/
});

// Disallow all whitespace
yup.addMethod(yup.string, 'noWhitespace', function (message = 'Whitespace is not allowed') {
  return this.matches(/^\S+$/, message);
});

// Must start with a letter
yup.addMethod(yup.string, 'startsWithLetter', function (message = 'Must start with a letter') {
  return this.matches(/^[a-zA-Z]/, message);
});

yup.addMethod(yup.string, 'isMongoId', function (message = 'Invalid ObjectId') {
  return this.matches(/^[a-f\d]{24}$/i, message);
});
