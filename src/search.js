"use strict";

const lunr = require("lunr");

let index;

/**
 * 重置搜索的索引
 */
function resetIndex() {
  index = lunr(function() {
    this.field("file");
    this.field("type");
    this.ref("path");
  });
}

/**
 * 添加对文件的索引，用于后续搜索
 * @param {*} file
 */
function addToIndex(file) {
  // if (!index) {
  //   resetIndex();
  // }
  console.dir(index);
  index.add(file);
}

function find(query, cb) {
  if (!index) {
    resetIndex();
  }
  const results = index.search(query);
  cb(results);
}

module.exports = {
  addToIndex,
  find,
  resetIndex
};
