/* 
SCHEMA
----DataBase: LC_Bible_Notes
    ----Object.Store: The Book Name
        ----Records: Verse notes

1. Clicking on the show_notes button
    a. If the 'db' variable is null/undefined, will Open/Create the indexDB if it is not already :: createDB() ::
    b. Whether or not it goes through the preceding step, it will (then) try to retrieve the note from the database if it is available
2. Clicking on the save_note button will add the note to the sub-database of the bibleBook 
    a. First it will check for the object.store, which is the Bible Book, e.g., Romans, Genesis, etc.
    b. Then it will check for the record of the verse if it is available
*/


// Modified from code on ::: https://www.w3.org/TR/IndexedDB/
// function indexedDBgeneric(nameOfDataBase = "library"){
// Create a DataBase
let nameOfDataBase = "LC_Bible_Notes";
let db;
// indexedDB.databases().then(r => console.log(r))

//The notes are under Bible Books, e.g., Genesis, Revelation, ICorinthians, etc.
//They will be supplied dynamically
let bibleBook_IDB;
// Open database on page load
justOpentheIndxDB()

function justOpentheIndxDB() {
    request = indexedDB.open(nameOfDataBase);
    request.onsuccess = function () {
        db = request.result;
    }
}

function createDB(dbVersionNum, fromPopulateIDB) {

    let request;
    if (dbVersionNum) {
        request = indexedDB.open(nameOfDataBase, dbVersionNum);
    } else {
        request = indexedDB.open(nameOfDataBase);
    }

    // The database did not previously exist, so create object stores and indexes.
    request.onupgradeneeded = function () {
        console.log(bibleBook_IDB);
        let db = request.result;

        /*
        CREATE OBJECT.STORE (e.g., Revelation, Genesis, Romans, Galatians, etc.,)
        An object store can only be created/modified while updating the DB version, in upgradeneeded handler.
        */
        // create store for all bible books
        let all66books = bible.Data.bookNamesByLanguage.en;
        // For non canonical books
        if (bibleBook_IDB && !all66books.includes(bibleBook_IDB)) {
            createBibleBookStore(bibleBook_IDB)
        }
        // These are all loaded by default
        else {
            if (!all66books.includes(bibleBook_IDB)) {
                all66books.forEach(bibleBook_IDB => {
                    createBibleBookStore(bibleBook_IDB)
                });
            }
            // Take note that books are arranged alphabetically in the database
        }

        function createBibleBookStore(bibleBook_IDB) {
            let store = db.createObjectStore(bibleBook_IDB, {
                keyPath: "id"
            }); // bookChapter&Verse, e.g., '20.1', will be the key
            // let titleIndex = store.createIndex("by_title", "title", {unique: true});
            let refIndex = store.createIndex("by_ref", 'bCbV', {
                unique: true
            });
        }
    };
    request.onsuccess = function () {
        db = request.result;
        // If the book does not exist, then create it
        // For this, the onupgradeneeded has to be triggered and this can only happen if the version number is higher than the current version number
        // Therefore, we get the current version number and increase it
        console.log(db.objectStoreNames.contains(bibleBook_IDB))
        if (!db.objectStoreNames.contains(bibleBook_IDB)) {
            let newDBversionNum = db.version + 1;
            console.log(newDBversionNum);
            db.close();
            // setTimeout(() => {createDB(newDBversionNum)}, 1000);
            createDB(newDBversionNum);
            return
        }
    };
    request.onblocked = function () {
        alert("You need to refresh the page, then try to add notes for the non-canonical book.")
    };
}
let populatefunc = 0;

// Populate the database using a transaction.
function populateDB(_bCbV, verseNote) {
    let appendOBJ = {
        id: Number(_bCbV),
        bCbV: Number(_bCbV),
        verse_note: verseNote,
    };
    console.log(bibleBook_IDB)
    if (db.objectStoreNames.contains(bibleBook_IDB)) {
        console.log('populate> !YES')
        let tx = db.transaction(bibleBook_IDB, "readwrite");
        let store = tx.objectStore(bibleBook_IDB);

        store.put(appendOBJ);
        // store.put({
        //     title: "Water Buffaloes",
        //     author: "Fred",
        //     isbn: 234567
        // });

        tx.oncomplete = function () {
            // All requests have succeeded and the transaction has committed.
        };
    } else {
        // If the ObjectStore does not exist, create it (it can only be created in indexedDB.open...)
        console.log('populate? !No')
        createDB(null, [_bCbV, verseNote])
    }
}

// Look up a single book in the database by title using an index.
function lookUpBookbyCVref(bCbV) {
    function lookUp() {
        console.log('looking up')
        let tx = db.transaction(bibleBook_IDB, "readonly");
        let store = tx.objectStore(bibleBook_IDB);
        let index = store.index("by_ref");

        // let request = index.get("Bedrock Nights");
        let request = index.get(bCbV);
        request.onsuccess = function () {
            let matching = request.result;
            if (matching !== undefined) {
                // A match was found.
                console.log(matching.id, matching.verse_note);
                return matching.verse_note
            } else {
                // No match was found.
                console.log('No match was found');
                return null
            }
        };
    }
    if (db) {
        lookUp()
    } else {
        console.log(db)
        return false
    }

}

// Look up all books in the database by author using an index and a cursor.
function lookupBookbyIndxnCursor() {

    let tx = db.transaction(bibleBook_IDB, "readonly");
    let store = tx.objectStore(bibleBook_IDB);
    let index = store.index("by_author");

    let request = index.openCursor(IDBKeyRange.only("Fred"));
    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            // Called for each matching record.
            report(cursor.value.id, cursor.value.verse_note, cursor.value.bCbV);
            cursor.continue();
        } else {
            // No more matching records.
            report(null);
        }
    };
}

/* **************************************************************************** */
/* **************************************************************************** */
/* **************************************************************************** */

// //Check if DataBase exists
// // (await window.indexedDB.databases()).map(db => db.name).includes("LC_Bible_Notes");

function save_verse_note_to_indexedDB(e) {
    if (e.target.matches('.note_save_button')) {
        bibleBook_IDB = e.target.getAttribute('bk');
        console.log(bibleBook_IDB)
        let _bCbV = e.target.getAttribute('b_cv');
        
        let verseNote = elmAhasElmOfClassBasAncestor(e.target, '.verse_note').querySelector('.text_content');
        
        let verseNoteInnerHTML = verseNote.innerHTML;
        let verseNoteInnerText = verseNote.innerText;
        
        console.log(verseNoteInnerText)

        if(verseNoteInnerText.trim()!=''){
            populateDB(_bCbV, verseNoteInnerHTML)
            /* IF verse note exists in indXDB, modify it */
            indicateThatVerseHasNote();
        }
    }
}

function getNoteFromIDBifAvailable(bN, _bCbV, whereTOappend) {
    // console.log(db.objectStoreNames.contains(bibleBook_IDB))

    bibleBook_IDB = bN; //the name of the database to check
    // First, check if the Book ObjectStore exists
    //If it exits, then get the verseNote if it exists in the Book ObjectStore
    if (db.objectStoreNames.contains(bibleBook_IDB)) {
        // let verseNote = lookUpBookbyCVref(_bCbV)
        // let verseNote = lookUpBookbyCVref(Number(_bCbV));
        let tx = db.transaction(bibleBook_IDB, "readonly");
        let store = tx.objectStore(bibleBook_IDB);
        let index = store.index("by_ref");

        // let request = index.get("Bedrock Nights");
        let request = index.get(Number(_bCbV));
        request.onsuccess = function () {
            let matching = request.result;
            if (matching !== undefined) {
                // A match was found.
                console.log(matching.verse_note)
                if (whereTOappend) {
                    whereTOappend.innerHTML = matching.verse_note;
                } else {
                    // The goal is just to see if the verse has a note
                }
                // return matching.verse_note
                return true
            } else {
                // No match was found.
                return null
            }
        };
    } else {
        console.log('::IndexedDB DOES NOT HAVE' + bibleBook_IDB)
        createDB()
    }
}

// function getBibleBooksSavedNotes(bookName) {
//     // let db = LC_Bible_Notes
//     db.collection(bookName).orderBy('id').get().then(users => {
//         console.log('users: ', users)
//     })
// }


/* GET ALL RECORDS IN AN OBJECT STORE */
//https://dzone.com/articles/getting-all-stored-items
function getAllItems(storeName,callback) {
    var trans = db.transaction(storeName, IDBTransaction.READ_ONLY);
    var store = trans.objectStore(storeName);
    var items = [];
 
    trans.oncomplete = function(evt) {  
        callback(items);
    };
 
    var cursorRequest = store.openCursor();
 
    cursorRequest.onerror = function(error) {
        console.log(error);
    };
 
    cursorRequest.onsuccess = function(evt) {                    
        var cursor = evt.target.result;
        if (cursor) {
            items.push(cursor.value);
            cursor.continue();
        }
    };
}
// USAGE
// getAllItems('Daniel',function (items) {
//     var len = items.length;
//     for (var i = 0; i < len; i += 1) {
//         console.log(items[i]);
//     }
// });

/* To Indicate VErses That Have Notes in the Database */

function indicateThatVerseHasNote() {

    let stringOfversesWithNotes = '',stringOfversesWithNotesSTARRED = '';
    let allLoadedBooks = main.querySelectorAll('.chptverses');
    let old_bk_name = null;
    allLoadedBooks.forEach(code => {
        let bk_name = code.getAttribute('bookname');
        if (old_bk_name != bk_name) {
            let newCodeRef;

            getAllItems(bk_name, function (items) {
                var len = items.length;
                for (var i = 0; i < len; i += 1) {
                    newCodeRef= '[ref="' + bk_name + ' ' + items[i].id.toString().split('.').join(':') + '"]';
                    let coma;
                    if(stringOfversesWithNotes==''){coma=''}else{coma=', '}
                    stringOfversesWithNotes = stringOfversesWithNotes + coma + newCodeRef;
                    stringOfversesWithNotesSTARRED = stringOfversesWithNotesSTARRED + coma + newCodeRef + ':before';
                    refsWithVerseNoteStyleRule = stringOfversesWithNotes + '{font-weight:bold; font-style:italic; border-bottom:2.5px solid var(--shadow-color); border-radius:2px;}'
                    +
                    stringOfversesWithNotesSTARRED + '{content:"* "}'
                    createNewStyleSheetandRule('refs_with_versenotes',refsWithVerseNoteStyleRule);
                }
            });

        }
        old_bk_name = bk_name;
    });
}