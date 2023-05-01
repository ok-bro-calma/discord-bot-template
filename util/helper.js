module.exports = {
  // a menu is generally in expectation everytime
  menu: class {
    constructor(...pages) { // takes a single or multiple array of pages having your content
      pages = pages.filter(Array.isArray);
      if (![1, 2].includes(pages.length)) return;
      this.left = pages.length > 1 ? pages.shift() : [];
      this.right = pages.pop();
    }
    // first page
    get first() {
      this.right.unshift(...this.left);
      return this.current;
    }
    // previous page
    get previous() {
      this.right.unshift(this.left.pop());
      return this.current;
    }
    // current page number
    get index() {
      return this.left.length + 1;
    }
    // current page
    get current() {
      return this.right[0];
    }
    // total number of pages
    get length() {
      return this.left.length + this.right.length;
    }
    // next page
    get next() {
      this.left.push(this.right.shift());
      return this.current;
    }
    // last page
    get last() {
      this.left.push(...this.right);
      return this.previous;
    }
    // jump to a page by number
    page(pos) {
      if (isNaN(pos)) return;
      if (pos <= 0 || pos > this.length) return;
      this.left.push(...this.right);
      this.right.unshift(...this.left.splice(pos - 1));
      return this.current;
    }
  },
  
  // calculating time is the second most priority
  time: (s, t) => {
    // return the current time if not no types match
    if (!['number', 'string'].includes(typeof s)) {
      const d = new Date(Date.now() + /**/ 330 /* [India Standard Time Offset (to UTC ofc) (in minutes)] */ /**/ * 60_000);
      const time = [d.getHours(), d.getMinutes(), d.getSeconds()];
      return time.map(t => t < 10 ? `0${t}` : `${t}`).join(':');
    };
    
    // from hereon you may customize the input and output params by yourself
    // if its a string
    if (isNaN(s)) {
      s = s.split(':').map(Number).filter(n => typeof n === 'number').reverse();
      if (!s.length) return;
      const map = [
        1,
        60,
        60 * 60,
        24 * 60 * 60,
        7 * 24 * 60 * 60,
        30 * 24 * 60 * 60,
        12 * 30 * 24 * 60 * 60
      ];
      // returns the number of seconds!
      return s.reduce((t, c) => t + c * map[i], 0);
    };
    
    // if its a number (seconds)
    s = Math.floor(s);
    s = [
      Math.floor(s/(12 * 30 * 24 * 60 * 60))%12,
      Math.floor(s/(30 * 24 * 60 * 60))%30,
      Math.floor(s/(7 * 24 * 60 * 60))%7,
      Math.floor(s/(24 * 60 * 60))%24,
      Math.floor(s/(60 * 60))%60,
      Math.floor(s/60)%60,
      s%60
    ];
    let length = t?.split(':')?.length || 1;
    while (!s[0] && s.length > length) s.shift();
    // returns a string!
    return s.map(t => t < 10 ? `0${t}` : `${t}`).join(':');
  },
  
  // formats blocks of code to readable string! third most priority.
  clean: async (text) => {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
    text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  },
  
  // just a regex to check for urls
  url: (link) => /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(link)
};
