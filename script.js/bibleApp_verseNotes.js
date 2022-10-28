ppp.addEventListener("click", showVerseNote);
ppp.addEventListener("click", save_verse_note_to_indexedDB);

function showVerseNote(e, x) {
    if (e) {
        if (e.target.matches('#verse_notes_button') || e.target.parentNode.matches('#verse_notes_button')) {
            appendVerseNote(e);
        }
        if (e.target.matches('.note_edit_button')) {
            let saveBtn = e.target.parentNode.querySelector('.note_save_button')
            editVerseNote(eTarget = e.target, e, saveBtn);
        }
    } else {
        editVerseNote(x);
    }
}

function appendVerseNote(e) {
    let eTarget;
    // if (e.target.matches('#verse_notes_button')) {
    eTarget = e.target
    // } else
    if (e.target.matches('#verse_notes_button a')) {
        eTarget = e.target.parentNode;
    }
    clickedVerseRef = elmAhasElmOfClassBasAncestor(eTarget, '[ref]').getAttribute('ref');
    let siblingVersenote;
    let masterVerseHolder = elmAhasElmOfClassBasAncestor(e.target, '.vmultiple');

    //Make notes always come after crossref
    let whereTOappend = undefined;
    whereTOappend = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.crossrefs', '.vmultiple').elm2appendAfter;
    // if (X_hasNoSibling_Y_b4_Z(masterVerseHolder,'.crossrefs','.vmultiple').yes_no) {
    // }

    //If verse_note is not already attached to verse
    if (!masterVerseHolder.classList.contains('showing_versenote')) {
        let noteID = 'note' + masterVerseHolder.id.replaceAll(".", "_");
        let chapterHolder = elmAhasElmOfClassBasAncestor(masterVerseHolder, '.chptverses');
        
        //GET CURRENT BOOK NAME (NEEDED FOR INDEXED-DB))
        let clickedVerseRefObj = breakDownClickedVerseRef();
        let bN = clickedVerseRefObj.bN;
        let bCnCv = clickedVerseRefObj.bCnCv;
        bibleBook_IDB = bN;

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

            //OPEN DATABASE IF NOT OPEN
            function ifNoteAppend() {
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
            }

            verseNoteDiv.append(newVerseNote);

            whereTOappend.parentNode.insertBefore(verseNoteDiv, whereTOappend.nextSibling);
            masterVerseHolder.classList.add('showing_versenote');
            // eTarget.querySelector('a').setAttribute('href', '#' + noteID);
            siblingVersenote = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.verse_note', '.vmultiple').elmY;
            setTimeout(() => {
                siblingVersenote.classList.remove('slideup');
            }, 1);

        }
    } else {
        siblingVersenote = X_hasNoSibling_Y_b4_Z(masterVerseHolder, '.verse_note', '.vmultiple').elmY;
        siblingVersenote.classList.add('slideup');
        setTimeout(() => {
            // siblingVersenote.remove();
            siblingVersenote.style.display = 'none';
            masterVerseHolder.classList.remove('showing_versenote');
        }, 100);
    }
}

function editVerseNote(eTarget, e, saveBtn) {
    let eTargets_note = eTarget.parentNode.parentNode.querySelector('.text_content');
    editNotez = eTargets_note;
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
            disableCKEditor()
            if (oldeditbtn != e.target) {
                noteEditingTarget.id = '';
            }
        }

        saveBtn.disabled = false; //enable save verse note button

        eTargets_note.contentEditable = 'true';
        eTargets_note.id = 'noteEditingTarget';
        eTarget.style.backgroundColor = 'pink';
        eTarget.classList.add('active');

        enableCKEditor('noteEditingTarget', eTarget)
    } else if (eTargets_note.contentEditable == 'true') {
        saveBtn.disabled = true; //disable save verse note button

        eTargets_note.contentEditable = 'false';
        eTarget.style.backgroundColor = '';
        eTarget.classList.remove('active');
        disableCKEditor()
        noteEditingTarget.id = '';
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