// For '#verse_notes_button' && '.note_edit_button'
ppp.addEventListener("click", showVerseNote);
// To open verse note in new window
ppp.addEventListener("contextmenu", showVerseNote);
// To make verseNote editable on doubleClick
ppp.addEventListener("dblclick", showVerseNote);
// To save or stop editing currently edited verseNote
ppp.addEventListener("keydown", showVerseNote);
// For '#note_save_button'
ppp.addEventListener("click", save_verse_note_to_indexedDB);
// To save new/edited verse note to coressponding JSON file
ppp.addEventListener("click", saveJSONFileToLocalDrive);

function showVerseNote(e, x) {

    if(e){
        if (e.type=='click') {
            // Get verse note, if available, from JSON file and append it
            if (e.target.matches('#verse_notes_button') || e.target.parentNode.matches('#verse_notes_button')) {
                appendVerseNote(e);
            }
            // Edit verse note
            if (e.target.matches('.note_edit_button')) {
                let saveBtn = e.target.parentNode.querySelector('.note_save_button')
                editVerseNote(eTarget = e.target, e, saveBtn);
            }
        } else if (e.type=='contextmenu') {
            // Open verse note in a new window (on rightClick of #verse_notes_button)
            if (e.target.matches('#verse_notes_button') || e.target.parentNode.matches('#verse_notes_button')) {
                appendVerseNote(e);
            }
        }
        //make verseNote editable by double-clicking anywhere in the verse note
        else if (e.type=='dblclick') {
            if ((context_menu && (e.target!=context_menu && !elmAhasElmOfClassBasAncestor(e.target, '.context_menu'))) && elmAhasElmOfClassBasAncestor(e.target, '.verse_note')) {
                let verseNoteDiv = elmAhasElmOfClassBasAncestor(e.target, '.verse_note');
                let editBtn = verseNoteDiv.querySelector('.note_edit_button');
                let saveBtn = verseNoteDiv.querySelector('.note_save_button');
                editVerseNote(editBtn, e, saveBtn);
            }
        } 
        // ctrl+s for saving currently edited verseNote
        else if (e.ctrlKey && document.activeElement.matches('#noteEditingTarget')) {
            if(e.key==='s'||e.key==='S'){
                e.preventDefault();
                e.stopPropagation();
                //Get current book, chpt & verseNum from the active verseNote
                bookName=noteEditingTarget.getAttribute('bk');
                let cNv=noteEditingTarget.getAttribute('b_cv').split('.')
                chapternumber=cNv[0];
                verseNumber=cNv[1];
                /* MODIFY THE BIBLE NOTES JSON FILE */                 
                writeToVerseNotesFiles(bookName, chapternumber, verseNumber);
           }
        }
        // stop editing by pressing 'Escape' key 
        else if (e.key === 'Escape' && document.activeElement.matches('#noteEditingTarget')) {
            let verseNoteDiv = elmAhasElmOfClassBasAncestor(noteEditingTarget, '.verse_note');
            let editBtn = verseNoteDiv.querySelector('.note_edit_button');
            let saveBtn = verseNoteDiv.querySelector('.note_save_button');
            editVerseNote(editBtn, e, saveBtn);
        }
    }
    else {
            editVerseNote(x);
        }
}

/* TO GET VERSE NOTE FROM JSON FILE AND APPEND EITHER TO THE VERSENOTE DIV OR TO A NEW HTML PAGE */
function appendVerseNote(e) {
    let eTarget = e.target;
    //Get reference of clicked verse
    clickedVerseRef = elmAhasElmOfClassBasAncestor(eTarget, '[ref]').getAttribute('ref');
    let siblingVersenote;
    let masterVerseHolder = elmAhasElmOfClassBasAncestor(e.target, '.vmultiple');

    //Make notes always come after crossref
    let whereTOappend = undefined;
    whereTOappend = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.crossrefs', '.vmultiple').elm2appendAfter;

    /* CREATE VERSENOTE IF NOT AVAILABLE ELSE JUST TOGGLE IT */
    //If verse_note is not already attached to verse 
    if (!masterVerseHolder.classList.contains('showing_versenote')) {
        let noteID = 'note' + masterVerseHolder.id.replaceAll(".", "_");
        let chapterHolder = elmAhasElmOfClassBasAncestor(masterVerseHolder, '.chptverses');
        
        //GET CURRENT BOOK NAME, CHAPTER & VERSE (NEEDED TO RETRIEVE VERSE-NOTE))
        let clickedVerseRefObj = breakDownClickedVerseRef();
        let bN = clickedVerseRefObj.bN;
        let bC = clickedVerseRefObj.bC;
        let cV = clickedVerseRefObj.cV;
        let bCnCv = clickedVerseRefObj.bCnCv;
        bookName=bN, chapternumber=bC, verseNumber=cV;
        bibleBook_IDB = bN;

        if(e.type=='click'){
            if (vnt = chapterHolder.querySelector('#' + noteID)) {
                vnt.style.display = '';
                vnt.classList.remove('slideup');
                masterVerseHolder.classList.add('showing_versenote');
            } else {
                let verseNoteDiv = new DocumentFragment();
                
                let newVerseNote = verse_note.cloneNode(true);
                newVerseNote.id = noteID;

                let saveBtn = newVerseNote.querySelector('.note_save_button');
                let editBtn = newVerseNote.querySelector('.note_edit_button');

                //Add refrence book_name to the button
                saveBtn.setAttribute('bk', bN);
                saveBtn.setAttribute('b_cv', bCnCv);
                //Add refrence book_name to the button
                editBtn.setAttribute('bk', bN);
                editBtn.setAttribute('b_cv', bCnCv);
                //Add refrence book_name to the newVerseNote
                newVerseNote.querySelector('.text_content').setAttribute('bk', bN);
                newVerseNote.querySelector('.text_content').setAttribute('b_cv', bCnCv);

                //OPEN INDEXED-DATABASE IF NOT OPEN
                /* function ifNoteAppend() {
                    //if verse already has note, get it
                    if(db){
                        clearInterval(dbBuildTimer_1);//Since db has been created, clear the setinterval timer
                        let appendHere = newVerseNote.querySelector('.text_content');
                        console.log('::db created::')
                        getNoteFromIDBifAvailable(bN, bCnCv, appendHere);
                    }
                }
                var dbBuildTimer_1;
                if (!db) {
                    createDB();//Open (or create) the database
                    //Check at set intervals whether or not the db has been created
                    var dbBuildTimer_1 = setInterval(ifNoteAppend, 300);// If db available get the verse not if available
                } else {
                    ifNoteAppend()
                } */
                let appendHere = newVerseNote.querySelector('.text_content');
                verseNoteDiv.append(newVerseNote);
                whereTOappend.parentNode.insertBefore(verseNoteDiv, whereTOappend.nextSibling);
                masterVerseHolder.classList.add('showing_versenote');
                // eTarget.querySelector('a').setAttribute('href', '#' + noteID);
                siblingVersenote = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.verse_note', '.vmultiple').elmY;
                setTimeout(() => {
                    siblingVersenote.classList.remove('slideup');
                }, 1);
                //ACTUAL FUNCTION TO GET AND APPEND VERSE NOTE
                readFromVerseNotesFiles(bN, bC, cV,appendHere);//WORKS WITH JSON BIBLE NOTES
                console.log('retrieving note')
            }
        }
        else if(e.type=='contextmenu'){ // If it is rightClicked, it is to be opened in a new window
            // Open new window and append verse note to the body
            if(!window2){ // Check if win2 has been opened at any time (check if it has been created)
                openNewWindow()// the new window is assigned "window2"
                window2.close()
                openNewWindow()
            } else if(!window2.closed){
                window2.close()
                openNewWindow()
            }
            else if (window2.closed) { // if win2 is closed, reopen it
                openNewWindow()
            }
            window2.onload = function () {
                let appendHere = window2.document.querySelector('body');// Get the body in the new window and append there
                readFromVerseNotesFiles(bN, bC, cV,appendHere);//WORKS WITH JSON BIBLE NOTES
                // window2.focus()// Bring up the window
            }
        
        }
    }
    //Hide verseNote if available on note button click
    else {
        siblingVersenote = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.verse_note', '.vmultiple').elmY;
        siblingVersenote.classList.add('slideup');
        setTimeout(() => {
            // siblingVersenote.remove();
            siblingVersenote.style.display = 'none';
            masterVerseHolder.classList.remove('showing_versenote');
        }, 100);
    }
}

function editVerseNote(eTarget, e, saveBtn) { //Toggles editing of versnote on and off
    let eTargets_note = eTarget.parentNode.parentNode.querySelector('.text_content');
    editNotez = eTargets_note;

    // Turn ON verseNote editing
    if (eTargets_note.contentEditable == 'false') {
        //before this new button click check if another wasn't clicked before it.
        if (oldeditbtn = ppp.querySelector('.note_edit_button.active')) {
            let old_verse_note = elmAhasElmOfClassBasAncestor(oldeditbtn, '.verse_note');
            let oldeditbtn_note = old_verse_note.querySelector('.text_content');
            let old_save_btn = old_verse_note.querySelector('.note_save_button');
            old_save_btn.disabled = true; //disable save verse note button
            oldeditbtn_note.contentEditable = 'false';
            oldeditbtn.style.backgroundColor = '';
            oldeditbtn.classList.remove('active');
            // if (oldeditbtn != e.target) {
                noteEditingTarget.id = '';
            // }
            disableCKEditor()
        }

        if(eTargets_note.querySelector('.context_menu')){eTargets_note.querySelector('.context_menu').remove()}
        saveBtn.disabled = false; //enable save verse note button

        eTargets_note.contentEditable = 'true';
        eTargets_note.id = 'noteEditingTarget';
        // eTarget.style.backgroundColor = 'orange';
        eTarget.classList.add('active');

        enableCKEditor('noteEditingTarget', eTarget)
    } 

    // Turn OFF verseNote editing
    else if (e.type!='dblclick' && eTargets_note.contentEditable == 'true') {
        saveBtn.disabled = true; //disable save verse note button
        let noteForCurrentlyEditedVerse = generateRefsInNote(eTargets_note.innerHTML);
        eTargets_note.innerHTML = noteForCurrentlyEditedVerse;

        eTargets_note.contentEditable = 'false';
        eTarget.style.backgroundColor = '';
        eTarget.classList.remove('active');
        eTargets_note.id = '';
        disableCKEditor()

    }
}

function enableCKEditor(ID) {
    disableCKEditor()
    CKEDITOR.inline(ID, {
        // Allow some non-standard markup that we used in the introduction.
        extraAllowedContent: 'a(documentation);abbr[title];code',
        removePlugins: 'stylescombo',
        extraPlugins: 'sourcedialog',
        removeButtons: 'PasteFromWord',
        // Show toolbar on startup (optional).
        startupFocus: true
    });
}

function disableCKEditor() {
    for (k in CKEDITOR.instances) {
        var instance = CKEDITOR.instances[k];
        instance.destroy();
    }
}

/* FOR GENERATING RIGHTCLICKABLE REFERENCES AND STRONGS NUMBERS IN THE VERSENOTES */
function generateRefsInNote(txt){
    let bdb=bible.Data.books;
    for(i=0;i<bdb.length;i++){
        for(j=0;j<bdb[i].length;j++){
            let bdbString=bdb[i][j].toString();
            txt = findAndIndicateScriptureRefs(txt,bdbString);
        }
    }
    // Indicate strongs numbers
    txt = txt.replace(/((H|G)[0-9]+)/g, '<span class="strnum $1 vnotestrnum" strnum="$1">$1</span>')
    function findAndIndicateScriptureRefs(txt,bkName2find){
        txt = modifyQuotationMarks(txt)
        // Indicate verses
        txt = txt.replace(/([0-9]+)\s*([,-:])\s*([0-9]+)/g, '$1$2$3')
        txt = txt.replace(/([0-9]+)\s*([;])/g, '$1$2')
        let newBkReg = new RegExp(`(?<=\\b(${bkName2find})\\s*\\d+[:.]\\d+([-]\\d+)*([,]*\\d+([-]\\d+)*))(([;])\\s*((\\d+)[:](\\d+(-\\d+)*)))`, 'ig');
        txt = txt.replace(newBkReg, '$6 <span ref="$1 $8.$9">$7</span>');
        newBkReg = new RegExp(`(?<!ref=")\\b(${bkName2find})\\s*((\\d+)[:.]*((\\d+)((-\\d+)*((,\\d+)*(-\\d+)*))*))`, 'ig');
        txt = txt.replace(newBkReg, '<span ref="$1.$3.$4">$1 $2</span>')
        return txt
    }
    return txt
}