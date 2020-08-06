export const checkShipIsComplete = (cells, type) => {
  if (cells.length !== type.size) {
    return false;
  }
  var numbers = [];
  var letters = [];
  cells.forEach((s) => numbers.push(parseInt(s.replace(/[^0-9]/g, ""))));
  cells.forEach((s) => letters.push(s.replace(/[^A-Z]/g, "")));

  const numbersOrdered = numbers
    .sort(sortfunction)
    .filter((n, i) => numbers.sort(sortfunction).indexOf(n) === i);

  const lettersOrdered = letters
    .sort()
    .filter((l, i) => letters.sort().indexOf(l) === i);

  if (numbersOrdered.length !== 1 && lettersOrdered.length !== 1) {
    return false;
  }
  const numberSequence = numbersOrdered.filter((n, index, arr) => {
    if (index !== arr.length - 1) {
      return parseInt(arr[index + 1]) === parseInt(n) + 1;
    } else {
      return true;
    }
  });

  const letterSequence = lettersOrdered.filter((n, index, arr) => {
    if (index !== arr.length - 1) {
      return arr[index + 1] === nextLetter(n);
    } else {
      return true;
    }
  });

  if (
    numberSequence.length !== numbersOrdered.length ||
    letterSequence.length !== lettersOrdered.length
  ) {
    return false;
  }

  return true;
};

export const sortfunction = (a, b) => {
  return a - b;
};

export const nextLetter = (s) => {
  return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function (a) {
    var c = a.charCodeAt(0);

    return String.fromCharCode(++c);
  });
};
