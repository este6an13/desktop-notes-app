const { remote } = require('electron')
const main = remote.require('./index')

function openEntry(evt, entryType) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(entryType).style.display = "block";
  evt.currentTarget.className += " active";
  var ss = document.getElementById("searchSection");
  ss.style.display = "none";
}

function hideDisplayCommonDiv() {
  var cd = document.getElementById("commonDiv");
  if (cd.style.display === 'block') {
    cd.style.display = 'none';
  } else {
    cd.style.display = 'block';
  }
  var ss = document.getElementById("searchSection");
  ss.style.display = "none";
}

// Probably not he best way
function displaySearchSection() {
  var ss = document.getElementById("searchSection");
  var ds = document.getElementById("displaySection");
  var cd = document.getElementById("commonDiv");
  var tca = document.getElementsByClassName("tabcontent");
  cd.style.display = "none";
  tca[0].style.display = "none";
  tca[1].style.display = "none";
  tca[2].style.display = "none";
  ss.style.display = "block";
  ds.style.display = "block";
}

function cleanSearchInput() {
  var sci = document.getElementById("searchConceptInput");
  sci.value = '';
}


function addParentConcept() {
  var ci = document.getElementById("conceptInput");
  if (ci.value) {
    var identifier = ci.value.replace(' ', '');
    console.log(identifier);
    var pcs = document.getElementById("parentConceptsSelected");
    pcs.innerHTML += "<button id=\"" + identifier + "\" type=\"button\" class=\"parentConceptButton\" onclick=\"removeButton(\'" + identifier + "\')\">"+ci.value+"</button>";
  }
  ci.value = '';
}

function addTag() {
  var ti = document.getElementById("tagInput");
  if (ti.value) {
    var identifier = ti.value.replace(' ', '');
    console.log(identifier);
    var pcs = document.getElementById("selectedTags");
    pcs.innerHTML += "<button id=\"" + identifier + "\" type=\"button\" class=\"addedTagButton\" onclick=\"removeButton(\'" + identifier + "\')\">"+ti.value+"</button>";
  }
  ti.value = '';
}

function addRelatedConcept() {
  var rci = document.getElementById("relConceptInput");
  if (rci.value) {
    var identifier = rci.value.replace(' ', '');
    console.log(identifier);
    var pcs = document.getElementById("selectedRelatedConcepts");
    pcs.innerHTML += "<button id=\"" + identifier + "\" type=\"button\" class=\"relConceptButton\" onclick=\"removeButton(\'" + identifier + "\')\">"+rci.value+"</button>";
    console.log(pcs);
  }
  rci.value = '';
}

function removeButton(idButton) {
  console.log(idButton); // It prints the element. Interesting as if where printing the d variable
  // It seems that dash characters are not allowed with HTML identifiers. So I just replaced every blank space with ''
  var d = document.getElementById(idButton);
  console.log(d);
  d.remove();
}

// Execute a function when the user releases a key on the keyboard
function addParentConceptOnEnter(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("addParentConceptButton").click();
  }
};

// Execute a function when the user releases a key on the keyboard
function addTagOnEnter(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("addTagButton").click();
  }
};

// Execute a function when the user releases a key on the keyboard
function addRelatedConceptOnEnter(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("addRelatedConceptButton").click();
  }
};


function searchConceptOnEnter(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("searchConceptButton").click();
  }
}

function addEventListeners() {
  var ci = document.getElementById("conceptInput");
  var ti = document.getElementById("tagInput");
  var rci = document.getElementById("relConceptInput");
  var sci = document.getElementById("searchConceptInput");
  ci.addEventListener("keyup", addParentConceptOnEnter);
  ti.addEventListener("keyup", addTagOnEnter);
  rci.addEventListener("keyup", addRelatedConceptOnEnter);
  sci.addEventListener("keyup", searchConceptOnEnter);
}

function getFormattedCode(code) {
  console.log('Code: ' + code)
  let formattedCode = '';
  for (let i = 0; i < code.length; i++) {
    console.log(formattedCode);
    if (code[i] === '\\') {
      formattedCode += '\\'
    }
    formattedCode += code[i];
  }
  return formattedCode;
}

let equationsObjs = [];

async function addEquation() {
  var etit = document.getElementById("equationTitle");
  var etex = document.getElementById("equationText");
  var ec = document.getElementById("equationCode");
  var re = document.getElementById("renderedEquation");
  var formattedCode = getFormattedCode(ec.value);
  console.log(formattedCode);
  let equationObj = {
    title: '\'' + etit.value + '\'',
    text: '\'' + etex.value + '\'',
    code: '\'' + formattedCode + '\'',
  }
  console.log(equationObj);
  // Probably not the best option ...
  if (equationObj.title == '\'\'') {
    equationObj.title = 'null';
  }
  if (equationObj.text == '\'\'') {
    equationObj.text = 'null';
  }
  equationsObjs.push(equationObj);
  if (ec.value) {
    /*let html = MathJax.tex2chtml('\\sqrt{x^2+1}', {em: 12, ex: 6, display: true});
    console.log(html.getElementsByTagName('math')[0])
    document.body.innerHTML += html.getElementsByTagName('math')[0];*/
    re.innerHTML += '<div class="equationSpan">\
                      <h4 class="equationTitles">' + etit.value + '</h4>\
                      <p class="equationTexts">' + etex.value + '</p>\
                      <p class="equationDisplayZone">' + ec.value + '</p>\
                     </div>'
    MathJax.typeset([re]);
  }
  etit.value = '';
  etex.value = '';
  ec.value = '';
}

let sourcesObjs = [];

function addSource() {
  var stit = document.getElementById("sourceTitle");
  var stex = document.getElementById("sourceText");
  var sl = document.getElementById("sourceLink");
  var ls = document.getElementById("listedSource");
  let sourceObj = {
    title: '\'' + stit.value + '\'',
    text: '\'' + stex.value + '\'',
    link: '\'' + sl.value + '\'',
  }
  // Probably not the best option ...
  if (sourceObj.title == '\'\'') {
    sourceObj.title = 'null';
  }
  if (sourceObj.text == '\'\'') {
    sourceObj.text = 'null';
  }
  if (sourceObj.link == '\'\'') {
    sourceObj.link = 'null';
  }
  sourcesObjs.push(sourceObj);
  if (sl.value) {
    ls.innerHTML += '<div class="sourceSpan">\
                      <h4 class="sourceTitles">' + stit.value + '</h4>\
                      <p class="equationTexts">' + stex.value + '</p>\
                      <p style="color:blue; margin-left: 10px;">' + sl.value + '</p>\
                     </div>'
  }
  if (stit.value || sl.value || stex.value) {
    stit.value = '';
    stex.value = '';
    sl.value = '';
  }
}

function setAndSearchConcept(conceptName) {
  var sci = document.getElementById("searchConceptInput");
  sci.value = conceptName;
  var scb = document.getElementById("searchConceptButton");
  scb.click();
}

async function searchConcept() {
  var conceptTitle = document.getElementById("searchConceptInput").value;
  const results = await main.getConceptInfo(conceptTitle);
  console.log(results);
  var ds = document.getElementById("displaySection");
  ds.innerHTML = '';
  const parentConcepts = await main.getParentConcepts(conceptTitle);
  if (parentConcepts.length != 0) {
    ds.innerHTML += '<div id="parentConceptsSection"></div>'
  }
  for (var i = 0; i < parentConcepts.length; i++) {
    var pcs = document.getElementById("parentConceptsSection");
    pcs.innerHTML += '<button onclick="setAndSearchConcept(\'' + parentConcepts[i].TITLE_ENTRY + '\')">' + parentConcepts[i].TITLE_ENTRY + '</button>';
  }
  ds.innerHTML += '<div id="mainDisplaySection"></div>'
  var mds = document.getElementById("mainDisplaySection");
  mds.innerHTML += '<h2>' + results[3][0].TITLE_ENTRY + '</h2>'
  mds.innerHTML += '<p>' + results[3][0].TEXT_ENTRY + '</p>'
  if (!(results[0].length == 0 && results[1].length == 0 && results[2].length == 0)) {
    if (results[1].length != 0) {
      mds.innerHTML += '<div id="imagesDisplaySection"></div>'
      results[1].forEach(conceptImageRow => {
        var ids = document.getElementById("imagesDisplaySection");
        // I decided to check type for object because I am receiving results with this type when null
        if (!(typeof conceptImageRow.TITLE_IMAGE === 'object')) {
          ids.innerHTML += '<h4 class="imageTitles">' + conceptImageRow.TITLE_IMAGE + '</h4>'
        }
        ids.innerHTML += '<img class="imageDisplayed" src=\"C:\\Users\\dequi\\Desktop\\my-app\\src\\images\\' + conceptImageRow.FILE_IMAGE + '\">'
        if (!(typeof conceptImageRow.TEXT_IMAGE === 'object')) {
          ids.innerHTML += '<p>' + conceptImageRow.TEXT_IMAGE + '</p>'
        }
      });
    }
    if (results[0].length != 0) {
      mds.innerHTML += '<div id="equationsDisplaySection"></div>'
      results[0].forEach(conceptEquationRow => {
        var eds = document.getElementById("equationsDisplaySection");
        if (!(typeof conceptEquationRow.TITLE_EQUATION === 'object')) {
          eds.innerHTML += '<h4 class="equationTitles">' + conceptEquationRow.TITLE_EQUATION + '</h4>'
        }
        if (!(typeof conceptEquationRow.TEXT_EQUATION === 'object')) {
          eds.innerHTML += '<p>' + conceptEquationRow.TEXT_EQUATION + '</p>'
        }
        eds.innerHTML += '<p class="equationDisplayZone">' + conceptEquationRow.CODE_EQUATION + '</p>'
        MathJax.typeset();
        // MathJax.typeset();
      });
    }
    if (results[2].length != 0) {
      mds.innerHTML += '<div id="sourcesDisplaySection"></div>'
      results[2].forEach(conceptSourceRow => {
        var sds = document.getElementById("sourcesDisplaySection");
        if (!(typeof conceptSourceRow.TITLE_SOURCE === 'object')) {
          sds.innerHTML += '<h4>' + conceptSourceRow.TITLE_SOURCE + '</h4>'
        }
        if (!(typeof conceptSourceRow.TEXT_SOURCE === 'object')) {
          sds.innerHTML += '<p>' + conceptSourceRow.TEXT_SOURCE + '</p>'
        }
        sds.innerHTML += '<p style="color:blue;">' + conceptSourceRow.LINK_SOURCE + '</p>'
      });
    }
  }
  const childConcepts = await main.getChildConcepts(conceptTitle);
  if (childConcepts.length != 0) {
    ds.innerHTML += '<div id="childConceptsSection"></div>'
  }
  for (var i = 0; i < childConcepts.length; i++) {
    var ccs = document.getElementById("childConceptsSection");
    ccs.innerHTML += '<button onclick="setAndSearchConcept(\'' + childConcepts[i].TITLE_ENTRY + '\')">' + childConcepts[i].TITLE_ENTRY + '</button>';
  }
  const tags = await main.getTags(conceptTitle);
  if (tags.length != 0) {
    ds.innerHTML += '<div id="tagsSection"></div>'
  }
  for (var i = 0; i < tags.length; i++) {
    var ts = document.getElementById("tagsSection");
    ts.innerHTML += '<button>' + tags[i].NAME_TAG + '</button>';
  }
  const examplesPKs = await main.getExamplesPKs(conceptTitle);
  if (examplesPKs.length != 0) {
    ds.innerHTML += '<div id="exampleDisplaySection"></div>'
  }
  console.log(examplesPKs);
  for (var i = 0; i < examplesPKs.length; i++) {
    var exds = document.getElementById("exampleDisplaySection");
    var exampleResults = await main.getExamples(examplesPKs[i].ID_ENTRY);
    exds.innerHTML += '<p>' + exampleResults[3][0].TEXT_ENTRY + '</p>'
    if (!(exampleResults[0].length == 0 && exampleResults[1].length == 0 && exampleResults[2].length == 0)) {
      if (exampleResults[1].length != 0) {
        exds.innerHTML += '<div id="imagesDisplaySection2"></div>'
        exampleResults[1].forEach(exampleImageRow => {
          var ids = document.getElementById("imagesDisplaySection2");
          // I decided to check type for object because I am receiving results with this type when null
          if (!(typeof exampleImageRow.TITLE_IMAGE === 'object')) {
            ids.innerHTML += '<h4 class="imageTitles">' + exampleImageRow.TITLE_IMAGE + '</h4>'
          }
          ids.innerHTML += '<img class="imageDisplayed" src=\"C:\\Users\\dequi\\Desktop\\my-app\\src\\images\\' + exampleImageRow.FILE_IMAGE + '\">'
          if (!(typeof exampleImageRow.TEXT_IMAGE === 'object')) {
            ids.innerHTML += '<p>' + exampleImageRow.TEXT_IMAGE + '</p>'
          }
        });
      }
      if (exampleResults[0].length != 0) {
        exds.innerHTML += '<div id="equationsDisplaySection2"></div>'
        exampleResults[0].forEach(exampleEquationRow => {
          var eds = document.getElementById("equationsDisplaySection2");
          if (!(typeof exampleEquationRow.TITLE_EQUATION === 'object')) {
            eds.innerHTML += '<h4 class="equationTitles">' + exampleEquationRow.TITLE_EQUATION + '</h4>'
          }
          if (!(typeof exampleEquationRow.TEXT_EQUATION === 'object')) {
            eds.innerHTML += '<p>' + exampleEquationRow.TEXT_EQUATION + '</p>'
          }
          eds.innerHTML += '<p class="equationDisplayZone">' + exampleEquationRow.CODE_EQUATION + '</p>'
          MathJax.typeset();
        });
      }
      if (exampleResults[2].length != 0) {
        exds.innerHTML += '<div id="sourceDisplaySection2"></div>'
        exampleResults[2].forEach(exampleSourceRow => {
          var sds = document.getElementById("sourceDisplaySection2");
          if (!(typeof exampleSourceRow.TITLE_SOURCE === 'object')) {
            sds.innerHTML += '<h4>' + exampleSourceRow.TITLE_SOURCE + '</h4>'
          }
          if (!(typeof exampleSourceRow.TEXT_SOURCE === 'object')) {
            sds.innerHTML += '<p>' + exampleSourceRow.TEXT_SOURCE + '</p>'
          }
          sds.innerHTML += '<p style="color:blue;">' + exampleSourceRow.LINK_SOURCE + '</p>'
        });
      }
    }
  }
  const ideasPKs = await main.getIdeasPKs(conceptTitle);
  if (ideasPKs.length != 0) {
    ds.innerHTML += '<div id="ideaDisplaySection"></div>'
  }
  console.log(ideasPKs);
  for (var i = 0; i < ideasPKs.length; i++) {
    var idds = document.getElementById("ideaDisplaySection");
    var ideaResults = await main.getExamples(ideasPKs[i].ID_ENTRY);
    idds.innerHTML += '<p>' + ideaResults[3][0].TEXT_ENTRY + '</p>'
    if (!(ideaResults[0].length == 0 && ideaResults[1].length == 0 && ideaResults[2].length == 0)) {
      if (ideaResults[1].length != 0) {
        idds.innerHTML += '<div id="imagesDisplaySection3"></div>'
        ideaResults[1].forEach(ideaImageRow => {
          var ids = document.getElementById("imagesDisplaySection3");
          // I decided to check type for object because I am receiving results with this type when null
          if (!(typeof ideaImageRow.TITLE_IMAGE === 'object')) {
            ids.innerHTML += '<h3>' + ideaImageRow.TITLE_IMAGE + '</h3>'
          }
          ids.innerHTML += '<img class="imageDisplayed" src=\"C:\\Users\\dequi\\Desktop\\my-app\\src\\images\\' + ideaImageRow.FILE_IMAGE + '\">'
          if (!(typeof ideaImageRow.TEXT_IMAGE === 'object')) {
            ids.innerHTML += '<p>' + ideaImageRow.TEXT_IMAGE + '</p>'
          }
        });
      }
      if (ideaResults[0].length != 0) {
        idds.innerHTML += '<div id="equationsDisplaySection3"></div>'
        ideaResults[0].forEach(ideaEquationRow => {
          var eds = document.getElementById("equationsDisplaySection3");
          if (!(typeof ideaEquationRow.TITLE_EQUATION === 'object')) {
            eds.innerHTML += '<h4 class="equationTitles">' + ideaEquationRow.TITLE_EQUATION + '</h4>'
          }
          if (!(typeof ideaEquationRow.TEXT_EQUATION === 'object')) {
            eds.innerHTML += '<p>' + ideaEquationRow.TEXT_EQUATION + '</p>'
          }
          eds.innerHTML += '<p class="equationDisplayZone">' + ideaEquationRow.CODE_EQUATION + '</p>'
          MathJax.typeset();
        });
      }
      if (ideaResults[2].length != 0) {
        idds.innerHTML += '<div id="sourceDisplaySection3"></div>'
        ideaResults[2].forEach(ideaSourceRow => {
          var sds = document.getElementById("sourceDisplaySection3");
          if (!(typeof ideaSourceRow.TITLE_SOURCE === 'object')) {
            sds.innerHTML += '<h4>' + ideaSourceRow.TITLE_SOURCE + '</h4>'
          }
          if (!(typeof ideaSourceRow.TEXT_SOURCE === 'object')) {
            sds.innerHTML += '<p>' + ideaSourceRow.TEXT_SOURCE + '</p>'
          }
          sds.innerHTML += '<p style="color:blue;">' + ideaSourceRow.LINK_SOURCE + '</p>'
        });
      }
    }
  }
}


let imageFiles = []
let droppedImagesCounter = 0;

async function dropHandler(ev) {

  // alert('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  var di = document.getElementById("droppedImages");
  var reader = new FileReader();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file' &&
          ['image/png', 'image/gif', 'image/bmp', 'image/jpg', 'image/jpeg'].includes(ev.dataTransfer.items[i].type)) {
        var file = ev.dataTransfer.items[i].getAsFile();
        var destinationFolder = 'C:\\Users\\dequi\\Desktop\\my-app\\src\\images';
        var command = 'Copy-Item \'' + file.path + '\' ' + destinationFolder;
        imageFiles.push(file);
        console.log(file.name);
        await main.executePSCommand(command);
        // call the function
        di.innerHTML += '<div class="imageSpan">\
                          <div>\
                            <img src="./images' + '/' + file.name + '">\
                          </div>\
                          <div>\
                            <label>Image Title</label>\
                            <input size="25" style="border:1px solid #7ee0da;"></input>\
                            <br>\
                            <label>Image Description</label>\
                            <br>\
                            <textarea class="imageDescription" style="border:1px solid #7ee0da;">\</textarea>\
                          </div>\
                        </div>';
        var container = document.getElementsByClassName('imageSpan');
        var preview = container[droppedImagesCounter].getElementsByTagName('img')[0];
        reader.onloadend = function () {
          preview.src = reader.result;
        }
        reader.readAsDataURL(file);
        console.log(droppedImagesCounter);
      }
      droppedImagesCounter ++;
    }
  } /* else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      alert('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
    }
  } */

  // Pass event to removeDragData for cleanup
  // removeDragData(ev)
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

/*
function removeDragData(ev) {
  alert('Removing drag data')

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}
*/

let parentConceptsPKs = [];
let imagesObjs = [];
let addedTagsPKs = [];

async function organizeConceptEntry() {
  var conceptPK = await main.autonumeratePK('ENTRY');
  // I just needed to use the await keyword and use the function as async
  // resultPK.then(result => { conceptPK = result; });
  /* resultPK.then(function (result) {
      conceptPK = result;
    }).catch(function (err) {
      console.log(err);
    }); */
  var parentConceptsCollection = document.getElementsByClassName("parentConceptButton");
  if (parentConceptsCollection.length != 0) {
    for (var i = 0; i < parentConceptsCollection.length; i++) {
      var parentConceptPK = await main.getParentConceptsPK(parentConceptsCollection[i].innerHTML);
      parentConceptsPKs.push(parentConceptPK);
    }
  }
  let conceptObj = {
    id: conceptPK,
    title: '\'' + document.getElementById("conceptTitleInput").value + '\'',
    content: '\'' + document.getElementById("conceptContentInput").value + '\'',
    type: '\'C\'',
  }
  // Probably not the best option ...
  if (conceptObj.title == '\'\'') {
    conceptObj.title = 'null';
  }
  if (conceptObj.content == '\'\'') {
    conceptObj.content = 'null';
  }
  console.log(conceptObj);
  main.insertEntryRow(conceptObj);
  var imagesSpansCollection = document.getElementsByClassName("imageSpan");
  if (imagesSpansCollection.length != 0) {
    for (var i = 0; i < imagesSpansCollection.length; i++) {
      let imageObj = {
        file: '\'' + imageFiles[i].name + '\'',
        title: '\'' + imagesSpansCollection[i].getElementsByTagName("input")[0].value + '\'',
        desc: '\'' + imagesSpansCollection[i].getElementsByTagName("textarea")[0].value + '\'',
      }
      // Probably not the best option ...
      if (imageObj.title == '\'\'') {
        imageObj.title = 'null';
      }
      if (imageObj.desc == '\'\'') {
        imageObj.desc = 'null';
      }
      console.log(imageObj)
      imagesObjs.push(imageObj);
    }
    main.insertImagesRows(imagesObjs, conceptPK);
    imagesObjs = []
    imageFiles = []

  }
  if (equationsObjs.length != 0) {
    main.insertEquationsRows(equationsObjs, conceptPK);
  }
  equationsObjs = [];
  if (sourcesObjs.length != 0) {
    main.insertSourcesRows(sourcesObjs, conceptPK);
  }
  sourcesObjs = [];
  var addedTagsCollection = document.getElementsByClassName("addedTagButton");
  if (addedTagsCollection.length != 0) {
    for (var i = 0; i < addedTagsCollection.length; i++) {
      var tagPK = await main.getAddedTagsPK(addedTagsCollection[i].innerHTML);
      addedTagsPKs.push(tagPK);
    }
  }
  parentConceptsPKs.forEach(pcpk => {
    main.insertMMRow(pcpk, conceptPK, 'CONCEPT_PARENT');
  });
  parentConceptsPKs = [];
  addedTagsPKs.forEach(atpk => {
    main.insertMMRow(atpk, conceptPK, 'ENTRY_TAG');
  });
  addedTagsPKs = [];
}

async function organizeExampleEntry() {
  var examplePK = await main.autonumeratePK('ENTRY');
  var relatedConcept = document.getElementById("relatedConceptInput").value;
  var relatedConceptPK = await main.getRelatedConceptPK(relatedConcept);
  let exampleObj = {
    id: examplePK,
    title: 'null',
    content: '\'' + document.getElementById("exampleTextInput").value + '\'',
    type: '\'E\'',
  }
  // Probably not the best option ...
  if (exampleObj.text == '\'\'') {
    exampleObj.text = 'null';
  }
  console.log(exampleObj);
  main.insertEntryRow(exampleObj);
  var imagesSpansCollection = document.getElementsByClassName("imageSpan");
  if (imagesSpansCollection.length != 0) {
    for (var i = 0; i < imagesSpansCollection.length; i++) {
      let imageObj = {
        file: '\'' + imageFiles[i].name + '\'',
        title: '\'' + imagesSpansCollection[i].getElementsByTagName("input")[0].value + '\'',
        desc: '\'' + imagesSpansCollection[i].getElementsByTagName("textarea")[0].value + '\'',
      }
      // Probably not the best option ...
      if (imageObj.title == '\'\'') {
        imageObj.title = 'null';
      }
      if (imageObj.desc == '\'\'') {
        imageObj.desc = 'null';
      }
      imagesObjs.push(imageObj);
    }
    main.insertImagesRows(imagesObjs, examplePK);
    imagesObjs = []
    imageFiles = []
  }
  if (equationsObjs.length != 0) {
    main.insertEquationsRows(equationsObjs, examplePK);
  }
  equationsObjs = [];
  if (sourcesObjs.length != 0) {
    main.insertSourcesRows(sourcesObjs, examplePK);
  }
  sourcesObjs = [];
  main.insertMMRow(examplePK, relatedConceptPK, 'IDEA_CONCEPT');
}

let relConceptsPKs = [];

async function organizeIdeaEntry() {
  var ideaPK = await main.autonumeratePK('ENTRY');
  let ideaObj = {
    id: ideaPK,
    title: 'null',
    content: '\'' + document.getElementById("ideaInput").value + '\'',
    type: '\'I\'',
  }
  console.log(ideaObj);
  main.insertEntryRow(ideaObj);
  var relatedConceptsCollection = document.getElementsByClassName("relConceptButton");
  console.log(relatedConceptsCollection);
  if (relatedConceptsCollection.length != 0) {
    for (var i = 0; i < relatedConceptsCollection.length; i++) {
      var relConceptPK = await main.getRelatedConceptPK(relatedConceptsCollection[i].innerHTML);
      relConceptsPKs.push(relConceptPK);
    }
  }
  var imagesSpansCollection = document.getElementsByClassName("imageSpan");
  if (imagesSpansCollection.length != 0) {
    for (var i = 0; i < imagesSpansCollection.length; i++) {
      let imageObj = {
        file: '\'' + imageFiles[i].name + '\'',
        title: '\'' + imagesSpansCollection[i].getElementsByTagName("input")[0].value + '\'',
        desc: '\'' + imagesSpansCollection[i].getElementsByTagName("textarea")[0].value + '\'',
      }
      // Probably not the best option ...
      if (imageObj.title == '\'\'') {
        imageObj.title = 'null';
      }
      if (imageObj.desc == '\'\'') {
        imageObj.desc = 'null';
      }
      imagesObjs.push(imageObj);
    }
    main.insertImagesRows(imagesObjs, ideaPK);
    imagesObjs = []
    imageFiles = []
  }
  if (equationsObjs.length != 0) {
    main.insertEquationsRows(equationsObjs, ideaPK);
  }
  equationsObjs = [];
  if (sourcesObjs.length != 0) {
    main.insertSourcesRows(sourcesObjs, ideaPK);
  }
  sourcesObjs = [];
  relConceptsPKs.forEach(rcpk => {
    main.insertMMRow(ideaPK, rcpk, 'IDEA_CONCEPT');
  });
  relConceptsPKs = [];
}

function cleanWindow() {
  var di = document.getElementById("droppedImages");
  // di.innerHTML = '';
  var re = document.getElementById("renderedEquation");
  re.innerHTML = '';
  var ls = document.getElementById("listedSource");
  ls.innerHTML = '';
  var pcs = document.getElementById("parentConceptsSelected");
  pcs.innerHTML = '';
  var st = document.getElementById("selectedTags");
  st.innerHTML = '';
  var src = document.getElementById("selectedRelatedConcepts");
  // src.innerHTML = '';
  var cti = document.getElementById("conceptTitleInput");
  cti.innerHTML = '';
  var cci = document.getElementById("conceptContentInput");
  cci.innerHTML = '';
  var rci = document.getElementById("relatedConceptInput");
  rci.innerHTML = '';
  var eti = document.getElementById("exampleTextInput");
  eti.innerHTML = '';
  var ii = document.getElementById("ideaInput");
  ii.innerHTML = '';
}

async function makeConceptsList() {
  var allConcepts = await main.getAllConcepts();
  var d = document.getElementById("concepts");
  d.innerHTML = '';
  allConcepts.forEach(concept => {
    d.innerHTML += '<option value="' + concept.TITLE_ENTRY + '">'
  });
}

async function makeTagsList() {
  var allTags = await main.getAllTags();
  var d = document.getElementById("tags");
  d.innerHTML = '';
  allTags.forEach(tag => {
    d.innerHTML += '<option value="' + tag.NAME_TAG + '">'
  });
}

function insertConcept() {
  organizeConceptEntry();
  // cleanWindow();
  makeConceptsList();
  makeTagsList();
}

function insertExample() {
  organizeExampleEntry();
  // cleanWindow();
}

function insertIdea() {
  organizeIdeaEntry();
  // cleanWindow();
}
