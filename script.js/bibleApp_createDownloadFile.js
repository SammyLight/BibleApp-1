/* https://www.youtube.com/watch?v=io2blfAlO6E */
function downloadFile(text_data, name = "myData", format = "json") {
    // const blob = new Blob([JSON.stringify(obj, null, 2)], {
    //     type: "application/json",
    //   });
    // console.log(name)
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
}

// FINAL FORMAT
/* {
        "book":"Daniel",
        "notes": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {
                "_1":"<p>Michael is mentioned again.<\/p><p>There is certainly a prupose to the mentioning of Michael.<\/p>",

                "_2":"<p>Michael has something to do with the resurrection. Consider that he was also involved in the resurection of Moses when Satan contended against him.<\/p>"
            }
        ]
} */
let noteForCurrentlyEditedVerse;

function readFromVerseNotesFiles(bookName, chapternumber, verseNumber) {
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
            /* make copy of all the notes */
            // let copyOfAllVerseNotesInCurrentBook=b_bk.notes;
            // let copyOfAllVerseNotesInCurrentBook=b_bk.notes.slice();
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
            // console.log(copyOfAllVerseNotesInCurrentBook[chapternumber-1] = sortVnotesObj(originalVerseNotes))
            // console.log(copyOfAllVerseNotesInCurrentBook)
            b_bk['notes']=copyOfAllVerseNotesInCurrentBook
            downloadFile(JSON.stringify(b_bk), 'notes_'+bookName)
        }
    }
    return modifyCreateVerseNote()
}