import commonEnglishWords from "an-array-of-english-words";

const englishLetterFrequency = {
  a: 8.2,
  b: 1.5,
  c: 2.8,
  d: 4.3,
  e: 13,
  f: 2.2,
  g: 2,
  h: 6.1,
  i: 7,
  j: 0.15,
  k: 0.77,
  l: 4,
  m: 2.4,
  n: 6.7,
  o: 7.5,
  p: 1.9,
  q: 0.095,
  r: 6,
  s: 6.3,
  t: 9.1,
  u: 2.8,
  v: 0.98,
  w: 2.4,
  x: 0.15,
  y: 2,
  z: 0.074,
};

export function getTextLetterFrequency(text) {
  const letterFrequency = {};
  const totalLetters = text.length;

  for (let char of text.toLowerCase()) {
    if (/[a-z]/.test(char)) {
      letterFrequency[char] = (letterFrequency[char] || 0) + 1;
    }
  }

  for (let char in letterFrequency) {
    letterFrequency[char] = (letterFrequency[char] / totalLetters) * 100;
  }

  return letterFrequency;
}

export function compareFrequencies(textFrequency) {
  let score = 0;

  for (let char in englishLetterFrequency) {
    if (textFrequency[char]) {
      const difference = Math.abs(
        englishLetterFrequency[char] - textFrequency[char]
      );
      score += 1 - difference / 100;
    }
  }

  return score;
}

export function countCommonWords(text) {
  const words = text.toLowerCase().split(/\s+/);
  let commonWordCount = 0;

  for (let word of words) {
    if (commonEnglishWords.includes(word)) {
      ++commonWordCount;
    }
  }

  return commonWordCount / words.length;
}

export function isEnglish(text) {
  const commonWordPercentage = countCommonWords(text);
  const textLetterFrequency = getTextLetterFrequency(text);
  const frequencyScore = compareFrequencies(textLetterFrequency);

  const commonWordThreshold = 0.1;
  const frequencyThreshold = 0.6;

  return (
    commonWordPercentage >= commonWordThreshold &&
    frequencyScore >= frequencyThreshold
  );
}
