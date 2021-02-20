const { app, BrowserWindow } = require('electron');
const path = require('path');

require('./database');

const shell = require('node-powershell');
const { getConnection } = require('./database');


function executePSCommand(command) {
  let ps = new shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });
  ps.addCommand(command)
  ps.invoke().then(output => {
    console.log(output);
  }).catch(err => {
    console.log(err);
    ps.dispose();
  });
}

// Las siguientes tres funciones debieron ser una sola.

async function getParentConceptsPK(parentConcept) {
  const conn = await getConnection();
  const result = await conn.query('SELECT ID_ENTRY FROM ENTRY WHERE TITLE_ENTRY = \'' + parentConcept + '\'');
  return result[0].ID_ENTRY;
}

async function getConceptPK(conceptTitle) {
  const conn = await getConnection();
  const result = await conn.query('SELECT ID_ENTRY FROM ENTRY WHERE TITLE_ENTRY = \'' + conceptTitle + '\'');
  return result[0].ID_ENTRY;
}

async function getRelatedConceptPK(relatedConcept) {
  const conn = await getConnection();
  const result = await conn.query('SELECT ID_ENTRY FROM ENTRY WHERE TITLE_ENTRY = \'' + relatedConcept + '\'');
  return result[0].ID_ENTRY;
}

async function getAddedTagsPK(addedTag) {
  const conn = await getConnection();
  const result = await conn.query('SELECT ID_TAG FROM TAG WHERE NAME_TAG = \'' + addedTag + '\'');
  if (typeof result[0] === 'undefined') {
    await conn.query('INSERT INTO TAG VALUES (' + await autonumeratePK('TAG') + ', \'' + addedTag + '\')')
    const newTagPK = await conn.query('SELECT ID_TAG FROM TAG WHERE NAME_TAG = \'' + addedTag + '\'');
    return newTagPK[0].ID_TAG;
  }
  return result[0].ID_TAG;
}

async function getAllConcepts() {
  const conn = await getConnection();
  const result = await conn.query('SELECT TITLE_ENTRY FROM ENTRY WHERE TYPE_ENTRY = \'C\'');
  return result;
}

async function getAllTags() {
  const conn = await getConnection();
  const result = await conn.query('SELECT NAME_TAG FROM TAG');
  return result;
}

async function autonumeratePK(tableName) {
  const conn = await getConnection();
  const pkName = 'ID_' + tableName;
  const maxPK = await conn.query('SELECT MAX(' + pkName + ') MAX_PK FROM ' + tableName)
  if (typeof maxPK[0] === 'undefined') {
    return 1;
  }
  return maxPK[0].MAX_PK + 1;
}


async function insertImagesRows(imagesObjs, fk) {
  const conn = await getConnection();
  for (var i = 0; i < imagesObjs.length; i++) {
    await conn.query('INSERT INTO IMAGE VALUES (' + await autonumeratePK('IMAGE') + ', ' + fk + ', ' + imagesObjs[i].file + ', ' + imagesObjs[i].title + ', ' + imagesObjs[i].desc + ')');
  }
}

async function insertEquationsRows(equationsObjs, fk) {
  const conn = await getConnection();
  for (var i = 0; i < equationsObjs.length; i++) {
    await conn.query('INSERT INTO EQUATION VALUES (' + await autonumeratePK('EQUATION') + ', ' + fk + ', ' + equationsObjs[i].code + ', ' + equationsObjs[i].title + ', ' + equationsObjs[i].text + ')');
  }
}

async function insertSourcesRows(sourcesObjs, fk) {
  const conn = await getConnection();
  for (var i = 0; i < sourcesObjs.length; i++) {
    await conn.query('INSERT INTO SOURCE VALUES (' + await autonumeratePK('SOURCE') + ', ' + fk + ', ' + sourcesObjs[i].link + ', ' + sourcesObjs[i].title + ', ' + sourcesObjs[i].text + ')');
  }
}


async function insertEntryRow(entryObj) {
  const conn = await getConnection();
  await conn.query('INSERT INTO ENTRY VALUES (' + entryObj.id + ', ' + entryObj.title + ', ' + entryObj.content + ', ' + entryObj.type  + ')');
}

async function insertMMRow(fk1, fk2, tableName) {
  const conn = await getConnection();
  await conn.query('INSERT INTO ' + tableName + ' VALUES (' + fk1 + ', ' + fk2 + ')');
}

async function getConceptInfo(conceptTitle) {
  const conn = await getConnection();
  // The simple concept is useful in case there are no joins with the other tables.
  const simpleConcept = await conn.query('SELECT * FROM ENTRY WHERE TITLE_ENTRY = \'' + conceptTitle + '\'');
  const entryEquations = await conn.query('SELECT * FROM ENTRY NATURAL JOIN EQUATION WHERE TITLE_ENTRY = \'' + conceptTitle + '\'');
  const entryImages = await conn.query('SELECT * FROM ENTRY NATURAL JOIN IMAGE WHERE TITLE_ENTRY = \'' + conceptTitle + '\'');
  const entrySources = await conn.query('SELECT * FROM ENTRY NATURAL JOIN SOURCE WHERE TITLE_ENTRY = \'' + conceptTitle + '\'');
  return [entryEquations, entryImages, entrySources, simpleConcept];
}

async function getExamplesPKs(conceptTitle) {
  const conn = await getConnection();
  const conceptPK = await getConceptPK(conceptTitle);
  const result = await conn.query('SELECT ID_ENTRY FROM ENTRY, IDEA_CONCEPT WHERE ID_ENTRY = ID_IDEA AND TYPE_ENTRY = \'E\' AND ID_CONCEPT = ' + conceptPK);
  return result;
}

async function getIdeasPKs(conceptTitle) {
  const conn = await getConnection();
  const conceptPK = await getConceptPK(conceptTitle);
  const result = await conn.query('SELECT ID_ENTRY FROM ENTRY, IDEA_CONCEPT WHERE ID_ENTRY = ID_IDEA AND TYPE_ENTRY = \'I\' AND ID_CONCEPT = ' + conceptPK);
  return result;
}

async function getExamples(examplePK) {
  const conn = await getConnection();
  const simpleExample = await conn.query('SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + examplePK);
  // I think the natural join can be done because the the relations example (idea) and equation (image, source) share the same name for ID_ENTRY. Maybe I should have payed attention to that detail to the sentences of simples and getIdeasPKs and getExamplesPKs
  const exampleEquations = await conn.query('WITH example AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + examplePK + ') SELECT * FROM example NATURAL JOIN EQUATION');
  const exampleImages = await conn.query('WITH example AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + examplePK + ') SELECT * FROM example NATURAL JOIN IMAGE');
  const exampleSources = await conn.query('WITH example AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + examplePK + ') SELECT * FROM example NATURAL JOIN SOURCE');
  return [exampleEquations, exampleImages, exampleSources, simpleExample];
}

async function getIdeas(ideaPK) {
  const conn = await getConnection();
  const simpleIdea = await conn.query('SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + ideaPK);
  const ideaEquations = await conn.query('WITH idea AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + ideaPK + ') SELECT * FROM idea NATURAL JOIN EQUATION');
  const ideaImages = await conn.query('WITH idea AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + ideaPK + ') SELECT * FROM idea NATURAL JOIN IMAGE');
  const ideaSources = await conn.query('WITH idea AS (SELECT * FROM IDEA_CONCEPT, ENTRY WHERE ID_IDEA = ID_ENTRY AND ID_IDEA = ' + ideaPK + ') SELECT * FROM idea NATURAL JOIN SOURCE');
  return [ideaEquations, ideaImages, ideaSources, simpleIdea];
}

async function getParentConcepts(conceptTitle) {
  const conn = await getConnection();
  const parentConcepts = await conn.query('SELECT TITLE_ENTRY FROM CONCEPT_PARENT, ENTRY WHERE ID_PARENT = ID_ENTRY AND ID_CONCEPT = ' + await getConceptPK(conceptTitle));
  return parentConcepts;
}

async function getTags(conceptTitle) {
  const conn = await getConnection();
  const tags = await conn.query('SELECT NAME_TAG FROM ENTRY_TAG NATURAL JOIN TAG WHERE ID_CONCEPT = ' + await getConceptPK(conceptTitle));
  return tags;
}

async function getChildConcepts(conceptTitle) {
  const conn = await getConnection();
  const childConcepts = await conn.query('SELECT TITLE_ENTRY FROM CONCEPT_PARENT, ENTRY WHERE ID_CONCEPT = ID_ENTRY AND ID_PARENT = ' + await getConceptPK(conceptTitle));
  return childConcepts;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
    const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

module.exports = { getParentConceptsPK,
                   executePSCommand,
                   insertImagesRows,
                   autonumeratePK,
                   insertEntryRow,
                   insertEquationsRows,
                   insertSourcesRows,
                   getAddedTagsPK,
                   insertMMRow,
                   getRelatedConceptPK,
                   getAllConcepts,
                   getAllTags,
                   getConceptInfo,
                   getExamples,
                   getIdeas,
                   getExamplesPKs,
                   getIdeasPKs,
                   getParentConcepts,
                   getTags,
                   getChildConcepts }
