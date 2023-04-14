import i18next from 'i18next';

export const comma = (num: number) => {
  try {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    return '0';
  }
};

export const replaceNumToNumStr = (num: number) => {
  const currentLanguage = i18next.language;
  let str = '';

  if (currentLanguage === 'ko') {
    if (!isNaN(Number(num)) && num > 100000000) {
      //1억
      str = comma(Math.floor((num / 100000000) * 10) / 10) + '억';
    } else if (!isNaN(Number(num)) && num > 10000) {
      //1만
      str = comma(Math.floor((num / 10000) * 10) / 10) + '만';
    } else {
      str = comma(Math.floor(num || 0));
    }

    // if (!isNaN(Number(num)) && num > 10000000) {
    //   //1천만
    //   str = Math.floor((num / 10000000) * 10) / 10 + '천만';
    // } else if (!isNaN(Number(num)) && num > 1000000) {
    //   //1백만
    //   str = Math.floor((num / 1000000) * 10) / 10 + '백만';
    // } else if (!isNaN(Number(num)) && num > 100000) {
    //   //1십만
    //   str = Math.floor((num / 100000) * 10) / 10 + '십만';
    // } else {
    //   str = comma(Math.floor(num || 0));
    // }
  } else {
    if (!isNaN(Number(num)) && num > 1000000000) {
      //10억
      str = comma(Math.floor((num / 1000000000) * 10) / 10) + 'B';
    } else if (!isNaN(Number(num)) && num > 1000000) {
      //백만
      str = comma(Math.floor((num / 1000000) * 10) / 10) + 'M';
    } else if (!isNaN(Number(num)) && num > 1000) {
      //천
      str = comma(Math.floor((num / 1000) * 10) / 10) + 'K';
    } else {
      str = comma(Math.floor(num || 0));
    }
  }
  return str;
};

export const getChoSung = (str: string) => {
  // let cho = [
  //   'ㄱ',
  //   'ㄲ',
  //   'ㄴ',
  //   'ㄷ',
  //   'ㄸ',
  //   'ㄹ',
  //   'ㅁ',
  //   'ㅂ',
  //   'ㅃ',
  //   'ㅅ',
  //   'ㅆ',
  //   'ㅇ',
  //   'ㅈ',
  //   'ㅉ',
  //   'ㅊ',
  //   'ㅋ',
  //   'ㅌ',
  //   'ㅍ',
  //   'ㅎ',
  // ];
  let result = '';

  if (checkEngStart(str)) {
    // let code = str.charCodeAt(0) - 44032;
    // if (code > -1 && code < 11172) result = cho[Math.floor(code / 588)];
    // else result = str.charAt(0).toUpperCase();
    result = str.charAt(0).toUpperCase();
    if (result === 'ㄲ') {
      result = 'ㄱ';
    } else if (result === 'ㄸ') {
      result = 'ㄷ';
    } else if (result === 'ㅃ') {
      result = 'ㅂ';
    } else if (result === 'ㅆ') {
      result = 'ㅅ';
    } else if (result === 'ㅉ') {
      result = 'ㅈ';
    }
  } else if (checkNumStart(str)) {
    result = '123';
  } else {
    result = 'ETC';
  }
  return result;
};

export const checkHangulStart = (str: string) => {
  let ch = str[0];
  let korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
  return korean.test(ch);
};

export const checkEngStart = (str: string) => {
  let ch = str[0];
  let eng = /^[a-zA-Z]*$/g;
  return eng.test(ch);
};

export const checkNumStart = (str: string) => {
  let ch = str[0];
  let num = /^[0-9]*$/g;
  return num.test(ch);
};

export const checkUrl = (str: string) => {
  const urlReg = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return urlReg.test(str);
};
