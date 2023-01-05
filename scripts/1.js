/**
 * run it by typing the following in the CMD
 * ARR="super,20.5,test,23" node scripts/1.js
 */
const arr = process.env.ARR ? process.env.ARR.split(",") : [];

(()=> arr.map(item => Number(item) ? Number(item) : item))();
