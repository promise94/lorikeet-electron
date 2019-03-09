"use strict";

const fileSystem = require("./fileSystem");
const search = require("./search");
const path = require("path");

// let document;

function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);

  search.addToIndex(file);

  clone.querySelector("img").src = `images/${file.type}.svg`;
  clone.querySelector("img").setAttribute("data-filepath", file.path);
  clone.querySelector(".filename").innerText = file.file;

  if (file.type === "directory") {
    clone.querySelector("img").addEventListener(
      "dblclick",
      () => {
        loadDirectory(file.path)();
      },
      false
    );
  }

  mainArea.appendChild(clone);
}

function convertFolderPathIntoLinks(folderPath) {
  const folders = folderPath.split(path.sep);
  const contents = [];
  let pathAtFolder = "";
  folders.forEach(folder => {
    pathAtFolder += folder + path.sep;
    contents.push(
      `<span class="path" data-path="${pathAtFolder.slice(
        0,
        -1
      )}">${folder}</span>`
    );
  });
  return contents.join(path.sep).toString();
}

function displayFiles(err, files) {
  if (err) {
    return alert("Sorry");
  }
  files.forEach(displayFile);
}

function displayFolderPath(folderPath) {
  document.getElementById(
    "current-folder"
  ).innerHTML = convertFolderPathIntoLinks(folderPath);

  bindCurrentFolderPath();
}

function clearView() {
  const mainArea = document.getElementById("main-area");
  let firstChild = mainArea.firstChild;
  while (firstChild) {
    mainArea.removeChild(firstChild);
    firstChild = mainArea.firstChild;
  }
}

function loadDirectory(folderPath) {
  return function(window) {
    // if(!document) document = window.document;
    search.resetIndex();
    displayFolderPath(folderPath);
    fileSystem.getFilesInFolder(folderPath, (err, files) => {
      clearView();
      if (err) {
        return alert("Error");
      }
      fileSystem.inspectAndDescribeFiles(folderPath, files, displayFiles);
    });
  };
}

function bindDocument(window) {
  if (!document) {
    document = window.document;
  }
}

function bindSearchField(cb) {
  document.getElementById("search").addEventListener("keyup", cb, false);
}

function filterResults(results) {
  const validFilePaths = results.map(result => result.ref);
  const items = document.getElementsByClassName("item");
  for (const item of items) {
    let filePath = item.querySelector("img").getAttribute("data-filepath");
    if (validFilePaths.includes(filePath)) {
      item.style = null;
    } else {
      item.style = "display: none;";
    }
  }
}

function resetFilter() {
  const items = document.getElementsByClassName("item");
  for (const item of items) {
    item.style = null;
  }
}

function bindCurrentFolderPath() {
  const load = event => {
    console.dir(event);
    try {
      const folderPath = event.target.getAttribute("data-path");
      loadDirectory(folderPath)();
    } catch (error) {
      console.error(error);
    }
  };

  const paths = document.querySelectorAll(".path");
  for (let index = 0; index < paths.length; index++) {
    paths[index].addEventListener("click", load, false);
  }
}

module.exports = {
  bindDocument,
  displayFiles,
  loadDirectory,
  bindSearchField,
  filterResults,
  resetFilter
};
