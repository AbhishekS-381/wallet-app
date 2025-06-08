'use strict';

function round4(num) {
  return Math.round(Number(num) * 10000) / 10000;
}

function getCurrentDate() {
  return new Date().toISOString();
}

module.exports = {
  round4,
  getCurrentDate,
};
