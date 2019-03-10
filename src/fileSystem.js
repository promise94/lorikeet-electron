"use strict";

const os = require("os");
const fs = require("fs");
const async = require("async");
const path = require("path");

function getUsersHomeFolder() {
  return os.homedir();
}

function getFilesInFolder(folderPath, cb) {
  fs.readdir(folderPath, cb);
}

function inspectAndDescribeFiles(folderPath, files, cb) {
  async.map(
    files,
    (file, asyncCb) => {
      let resolvedFilePath = path.resolve(folderPath, file);
      inspectAndDescribeFile(resolvedFilePath, asyncCb);
    },
    cb
  );
}

function inspectAndDescribeFile(filePath, cb) {
  let result = {
    file: path.basename(filePath),
    path: filePath,
    type: ""
  };
  fs.stat(filePath, (err, stat) => {
    if (err) {
      cb(err);
    } else {
      if (stat.isFile()) {
        result.type = "file";
      }
      if (stat.isDirectory()) {
        result.type = "directory";
      }
      cb(err, result);
    }
  });
}

let shell = null;
if (process.versions.electron) {
  shell = require("electron").shell;
} else {
  shell = require("nw.gui").Shell;
}
function openFile(filePath) {
  shell.openItem(filePath);
}

module.exports = {
  getUsersHomeFolder,
  getFilesInFolder,
  inspectAndDescribeFiles,
  openFile
};
