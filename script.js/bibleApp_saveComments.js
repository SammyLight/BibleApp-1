/* ******************************************************************* */
/* DOWNLOAD MODIFIED JSON FILE */
/* function downloadFile(text_data, name = "myData", format = "json") {
  // const blob = new Blob([JSON.stringify(obj, null, 2)], {
  //     type: "application/json",
  //   });
  console.log(name)
  const blob = new Blob([text_data], {
      type: "application/octet-stream",
  });
  const href = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
      href,
      styles: "display:none",
      download: `${name}.${format}` // myData.json
  })
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(href);
  a.remove(a);
} */
/* https://www.youtube.com/watch?v=io2blfAlO6E */
/* ******************************************************************* */

/* ******************************************************************* */
/* USING THE FILE SYSTEM ACCESS API --(WORKS ONLY IN CHROMIUM BASED BROWSERS, E.G., EDGE, CHROME)*/
function saveToLocalDrive(jsonVerseNoteData) {
  // store a reference to our file handle
  let fileHandle;
  let fileName = `notes_${bookName}.json`; //File name should be bookName with .json extension, e.g., Romans.json
  const pickerOpts = {
    suggestedName: fileName, // `note_Romans.json`
    // startIn: 'C:\/Users\/samue\/OneDrive\/Desktop\/Folders on Desktop\/LC Apps\/LC BibleApp 2.0\/bible_notes',
    types: [{
      description: 'Text Files',
      accept: {
        'text/plain': ['.json'],
      }
    }, ],
    excludeAcceptAllOption: true,
    multiple: false
  };

  //Get file
  async function getFileToSaveTo() {
    [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    let fileData = await fileHandle.getFile();
    let fileText = await jsonVerseNoteData;
  }
  // Save to file
  async function saveFile() {
    if(!fileHandle){
      saveFileAs();
    } else {
    let stream = await fileHandle.createWritable(pickerOpts);
    await stream.write(jsonVerseNoteData)
    await stream.close()}
  }

  async function saveFileAs() {
    fileHandle = await window.showSaveFilePicker(pickerOpts);
    saveFile()
  }

  return saveFile()
}
// FINAL FORMAT
/* {
      "book":"Daniel",
      "notes": [{},{},{},{},{},{},{},{},{},{},{},{
              "_1":"<p>Michael is mentioned again.<\/p><p>There is certainly a prupose to the mentioning of Michael.<\/p>",
              "_2":"<p>Michael has something to do with the resurrection. Consider that he was also involved in the resurection of Moses when Satan contended against him.<\/p>"
          }
      ]
}
*/

/* ******************************************************************* */
/* MODIFY JSON VERSE NOTES FILE */
let noteForCurrentlyEditedVerse;

async function fetchBookNotes(jsBkNm) {
  if(!jsBkNm){jsBkNm=bookName}
  const response = await fetch(`/bible_notes/notes_${jsBkNm}.json`);
  return await response.json()
}

function readFromVerseNotesFiles(bookName, chapternumber, verseNumber, appendHere) {
  // console.log({bookName, chapternumber, verseNumber})
  if ((bookName == undefined) && (chapternumber == undefined) && (verseNumber == undefined)) {
      let refObj = breakDownClickedVerseRef();
      bookName = refObj.bN;
      chapternumber = refObj.bC;
      verseNumber = refObj.cV;
  }

  function getVerseNote() {
      fetchBookNotes().then(jsonObject => {
          bible_book = jsonObject,readNotes()
      })
      function readNotes(){
          if (bible_book.notes[chapternumber - 1]['_' + verseNumber]) {
              //Check for verse number
              noteForCurrentlyEditedVerse = bible_book.notes[chapternumber - 1]['_' + verseNumber];
              // console.log(bible_book.notes[chapternumber - 1].length);
              // console.log(noteForCurrentlyEditedVerse);
              noteForCurrentlyEditedVerse = generateRefsInNote(noteForCurrentlyEditedVerse);
              appendHere.innerHTML = noteForCurrentlyEditedVerse;
              return noteForCurrentlyEditedVerse
          }
      }
  }
  return getVerseNote()
}

function writeToVerseNotesFiles(bookName, chapternumber, verseNumber) {
  if ((bookName == undefined) && (chapternumber == undefined) && (verseNumber == undefined)) {
      let refObj = breakDownClickedVerseRef();
      bookName = refObj.bN;
      chapternumber = refObj.bC;
      verseNumber = refObj.cV;
  }

  async function fetchBookNotes() {
      const response = await fetch(`/bible_notes/notes_${bookName}.json`);
      return await response.json()
  }

  function modifyCreateVerseNote() {
      fetchBookNotes().then(jsonObject => {
          b_bk = jsonObject,writeNote()
      })
      function writeNote(){
          // let newNote = "html so so so";
          let newNote = noteEditingTarget.innerHTML;
          if(newNote=="<p><br><\/p>"){
            noteEditingTarget.innerHTML=null;
            newNote="";
            return
          }
          newNote = modifyQuotationMarks(newNote);
          /* make copy of all the notes */
          let copyOfAllVerseNotesInCurrentBook={...b_bk.notes};
          let originalVerseNotes = copyOfAllVerseNotesInCurrentBook[chapternumber-1];
          // console.log(Object.keys(b_bk.notes).length != 0 && b_bk.notes.constructor != Object)
          
          // let copyOfVerseNotes={...originalVerseNotes};
          // copyOfVerseNotes['_' + verseNumber] = newNote;
          originalVerseNotes['_' + verseNumber] = newNote;
          // console.log(newNote.constructor)

          /* FUNCTION TO SORT THE VERSE NOTES */
          function sortVnotesObj(obj) {
              // keys are in the format '_1'
              // Therefore, remove the '_' and
              // Sort then add back the '_' to the sorted numbers
              let arrayOfKeysInObj = Object.keys(obj);
              let sortedArrayOfOjectsKeys = arrayOfKeysInObj.map(ky=>Number(ky.substring(1))).sort(function(a, b){return a-b}).map(ky=>"_"+ky)
              return sortedArrayOfOjectsKeys.reduce(function (result, key) {
                  result[key] = obj[key];
                  return result;
              }, {});
          }

          /* REPLACE THE PREVIOUS VERSE NOTES FOR THE CHAPTER WITH THE MODIFIED VERSE NOTES */
          // console.log(originalVerseNotes['_' + verseNumber])
          copyOfAllVerseNotesInCurrentBook[chapternumber-1] = sortVnotesObj(originalVerseNotes)
          // console.log(copyOfAllVerseNotesInCurrentBook)
          b_bk['notes']=copyOfAllVerseNotesInCurrentBook;
          let newJSON_data = JSON.stringify(b_bk, null, 0);
          // downloadFile(newJSON_data, 'notes_'+bookName);
          saveToLocalDrive(newJSON_data);
      }
  }
  return modifyCreateVerseNote()
}
/* ******************************************************************* */

// ppp.addEventListener("click", saveJSONFileToLocalDrive);//For '#note_save_button'
// eventListener above moved to "bibleApp_verseNotes.js" file.

function saveJSONFileToLocalDrive(e) {
  if (e.target.matches('.note_save_button')) {
      /* MODIFY THE BIBLE NOTES JSON FILE */
      writeToVerseNotesFiles();
  }
}

/* ******************************************************************* */
/* ******************************************************************* */

function indicateThatVerseHasNoteInJSONnotes_file() {
  // get the books loaded on the page and get their chapters and verses that have notes, if any
  let stringOfversesWithNotes = '',stringOfversesWithNotesSTARRED = '';
  let allLoadedBooks = main.querySelectorAll('.chptverses');
  // console.log(allLoadedBooks)
  let old_bk_name = null;
  allLoadedBooks.forEach(code => {
      let bk_name = code.getAttribute('bookname');
      let bkIndx = '_' + bible.Data.allBooks.indexOf(bk_name);
      if (old_bk_name != bk_name) {
          let newCodeRef;
          getAllRefsInBookThatHaveNote(bk_name, function (items) {//works iwth JSON files as database
              var len = items.length;
              for (var i = 0; i < len; i += 1) {
                // newCodeRef= `[ref="${bk_name} ${items[i]}"]`;//use with 'getAllRefsInBookThatHaveNote()'
                // let coma;
                // if(stringOfversesWithNotes==''){coma=''}else{coma=', '}
                // stringOfversesWithNotes = stringOfversesWithNotes + coma + newCodeRef;
                // // console.log(stringOfversesWithNotes)
                // refsWithVerseNoteStyleRule = `${stringOfversesWithNotes}{box-sizing:border-box; font-weight:bolder; font-style:italic; color: maroon;box-shadow: 0 5px 5px -3px var(--shadow-color), 0 -5px 0 0 rgb(255, 243, 148)inset; text-decoration:none!important}`;
                // createNewStyleSheetandRule('refs_with_versenotes',refsWithVerseNoteStyleRule);
                let refCodeToMarkAsHavingNote = document.getElementById(`${bkIndx}.${Number(items[i].split(':')[0])-1}.${Number(items[i].split(':')[1])-1}`);
                if(refCodeToMarkAsHavingNote){
                  refCodeToMarkAsHavingNote.classList.add('noted')
                }
              }
          });
      }
      old_bk_name = bk_name;
  });
  // console.log(stringOfversesWithNotes)
  if(stringOfversesWithNotes){
    // refsWithVerseNoteStyleRule = stringOfversesWithNotes + '{box-sizing:border-box; font-weight:bolder; font-style:italic; color: maroon; border-radius:2px; background: rgb(203, 255, 125)!important; text-decoration:none!important}';
    // createNewStyleSheetandRule('refs_with_versenotes',refsWithVerseNoteStyleRule);
  }
  function getAllRefsInBookThatHaveNote(bookName,callback) {
    fetchBookNotes(bookName).then(jsonObject => {
        bible_book = jsonObject,versesWithNotes()
    })
    function versesWithNotes(){
      var items = [];
      for(key in bible_book.notes){
      let jsonChapter = bible_book.notes[key];
      if(Object.keys(jsonChapter).length>0){
        for(ky in jsonChapter){
            items.push(`${Number(key)+1}:${Number(ky.substring(1))}`)
            }
        }
      }
      callback(items);
    }
  }
}