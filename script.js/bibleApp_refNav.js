/* CREATE REFERENCE NAV-BAR */
function populateBooks() {
    var booksList = bible.Data.bookNamesByLanguage.en;
    var booksLength = booksList.length;

    var bookName = null,
        bookStartIndex = null,
        bookEndIndex = null,
        numberOfChapters = null;

    for (let i = 0; i < booksLength; i++) {
        //Books Select
        bibleBook = document.createElement('option');
        bibleBook.setAttribute('bookName', booksList[i]);
        bibleBook.setAttribute('bookindex', i);
        bookName = booksList[i];
        bibleBook.value = 'book_' + i;
        bibleBook.classList.add('bkname');
        bibleBook.textContent = booksList[i];

        selectBooks.appendChild(bibleBook);
        var chapterStartIncreamenter = 0;

        //Chapters Select
        var numberOfChapters = KJV[Object.keys(KJV)[i]].length;
        for (j = 0; j < numberOfChapters; j++) {
            var bookChapters = document.createElement('option');
            bookChapters.classList.add('book_' + i);
            bookChapters.setAttribute('bookName', bookName);
            bookChapters.setAttribute('bookIndex', i);
            bookChapters.setAttribute('chapterIndex', j);

            bookChapters.value = 'bk' + i + 'ch' + j;
            bookChapters.textContent = [j + 1];
            bookChapters.classList.add('chptnum');
            bookChapters.classList.add('show_chapter');
            selectChapters.appendChild(bookChapters);
        }
    }
}

function getBksChptsNum(xxx) {
    if (document.querySelector(".show_chapter")) {
        document.querySelectorAll(".show_chapter").forEach(element => {
            element.classList.remove("show_chapter");
        });
    }
    let classOfChapters = document.querySelectorAll('.' + xxx.value);
    classOfChapters.forEach(element => {
        element.classList.add("show_chapter");
    });
    //remove class from previous class holder in refnav
    if (bible_books.querySelector('.tmp_hlt')) {
        bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt')
    }
    xxx.classList.add('tmp_hlt')
}
/* ON PAGE LOAD SELECT THE FIRST BOOK AND CHAPTER */
function openachapteronpageload() {
    bible_books.querySelector('[bookname="Genesis"]').click();
    currentBookName = 'Genesis';
    bible_chapters.querySelector('[chapterindex="0"]').click();
    // document.querySelector('body>div.buttons').querySelector('button.showing').click();
    // togglenavbtn.click();
}

var stl = 0;
var currentBookValue = null;
// var strgsInVerseSpan;

//CLICKING ON BOOK-NAME AND CHAPTER-NUMBER
refnav.addEventListener("click", function (e) {
    clickedElm = e.target;
    if (e.target.matches("button")) {
        clickedElm.classList.toggle("active_button")
    } else if (elmAhasElmOfClassBasAncestor(e.target,'button')) {
        clickedElm = elmAhasElmOfClassBasAncestor(e.target,'button');
        clickedElm.classList.toggle("active_button")
    }
    //To populate book chapter numbers refnav pane
    if (clickedElm.classList.contains('bkname')) {
        getBksChptsNum(clickedElm);
        goto = 0;
        currentBookValue = clickedElm.getAttribute('value');
    }
    //To Get Text of Selected Chapter
    else if (clickedElm.classList.contains('chptnum')) {
        //For previous and next chapter
        if (clickedElm.previousElementSibling) {
            prevBibleChapter = clickedElm.previousElementSibling;
        }
        if (clickedElm.nextElementSibling) {
            nextBibleChapter = clickedElm.nextElementSibling;
        }
        // clickedElm.scrollIntoView(false)
        clearPageIfChapterNotPresent(clickedElm)
        getTextOfChapter(clickedElm, null, null, true, true);
        indicateBooknChapterInNav(null, clickedElm)
        currentChapterValue = clickedElm.getAttribute('value')
        // setItemInLocalStorage('lastBookandChapter', currentBookValue + ',' + currentChapterValue);
    }
})

function indicateBooknChapterInNav(bk, chpt) {
    if (bk == null) bk = bible_books.querySelector(`[bookname="${chpt.getAttribute('bookname')}"`);
    //remove class from previous class holder in refnav
    if (bible_books.querySelector('.tmp_hlt')) {
        bible_books.querySelector('.tmp_hlt').classList.remove('tmp_hlt');
    }
    // console.log(bk)
    if (bk) {
        if (refbk = bible_books.querySelector('.ref_hlt')) {
            refbk.classList.remove('ref_hlt')
        }
        bk.classList.add('ref_hlt');
        if (!checkVisible(bk)) {
            bk.scrollIntoView(false);
        }
        // getBksChptsNum(bk);
        if (!chpt) {
            let chapter_to_highlight = bible_chapters.querySelector('.show_chapter');
            chapter_to_highlight.classList.add('ref_hlt');
            if (!checkVisible(chapter_to_highlight)) {
                chapter_to_highlight.scrollIntoView(false);
            }
        }
    }
    if (chpt) {
        //remove class from previous class holder in refnav
        if (chptnumref = document.querySelector('.chptnum.ref_hlt')) {
            chptnumref.classList.remove('ref_hlt')
        }
        chpt.scrollIntoView(false);
        chpt.classList.add('ref_hlt');
        if (tmpbk = bible_books.querySelector('.tmp_hlt')) {
            tmpbk.classList.remove('tmp_hlt')
            let bookToHighlight = bible_books.querySelector('[bookname="' + chpt.getAttribute('bookname'));
            bookToHighlight.classList.add('ref_hlt');
            bookToHighlight.scrollIntoView(false);
        }
    }
    // UPDATE CACHE
    setItemInLocalStorage('lastBookandChapter', bk.getAttribute('value') + ',' + chpt.getAttribute("value") + ',' + chpt.getAttribute("bookname"));

    //BROWERS HISTORY
    // let derivedReference=chpt.getAttribute('bookname') + ' ' + chpt.innerText;
    // if(derivedReference!=reference.value){
    //     console.log(derivedReference)
    //     if (derivedReference!=window.location.hash.split('%20').join(' ')){
    //         updateRefBrowserHistory(derivedReference);
    //     }
    // }
}

//Hide refnav when escape is pressed
function hideRightClickContextMenu() {
    if (context_menu.matches('.rightclicked')) {
        context_menu.classList.remove('rightclicked')
        hideRefNav('hide', context_menu);
        newStrongsDef = '';
        if(toolTipON==true){toolTipOnOff();}
    }
}
document.addEventListener('keydown', function (e) {
    // let e = e || window.event;//Get event
    if (e.key === "Escape") {
        if(bible_nav.matches('.slidein')){hideRefNav('hide',bible_nav);}
        // else if(context_menu.matches('.slidein')){hideRightClickContextMenu();}
        else if(refnav.matches('.slidein')){hideRefNav('hide',refnav);}
    } /* else if (e.ctrlKey && document.activeElement.matches('#noteEditingTarget')) {
        var code = e.key;
        switch (code) {
        case 's'://Block Ctrl+S
        e.preventDefault();
        e.stopPropagation();
        break;
       }
       writeToVerseNotesFiles()
    } */
});

function toggleNav() {
    hideRefNav()
    // realine();
}

// FUNCTION TO SHOW OR HIDE REF_NAV
// hideRefNav(null, searchPreviewWindowFixed)
function hideRefNav(hORs, elm2HideShow, runfunc) {
    let elHS;
    function toShowOnlyOneAtaTime(){
        //To show only one at a time
        if(context_menu==undefined||elm2HideShow!=context_menu){
            let otherActiveButtonsToHide = app_settings.querySelectorAll('.active_button')
            otherActiveButtonsToHide.forEach(o_btns=>{o_btns.click()})}
    }
    if (elm2HideShow) {
        elHS = elm2HideShow
    } else {
        elHS = refnav
    }
    if (hORs == 'hide') {
        if(elHS == bible_nav){biblenavigation.classList.remove('active_button')}
        elHS.classList.remove('slidein');
        elHS.classList.add('slideout');
    } else if (hORs == 'show') {
        toShowOnlyOneAtaTime()

        if(elHS.id == 'searchPreviewWindowFixed'){elHS.classList.add('flex');searchsettings.classList.add('active_button')}
        elHS.classList.remove('slideout');
        elHS.classList.add('slidein');
    } else {
        if (elHS.classList.contains('slideout')) {
            toShowOnlyOneAtaTime()
            if(elHS==searchPreviewWindowFixed){
                elHS.classList.add('flex');
                searchsettings.classList.remove('active_button');
            }
            elHS.classList.remove('slideout');
            elHS.classList.add('slidein');
            // TO SCROLL BOOK AND CHAPTER INTO VIEW
            if(elHS == bible_nav){
                let higlightedBknChpt = bible_nav.querySelectorAll('.ref_hlt');
                higlightedBknChpt.forEach(refHlt => {
                    refHlt.scrollIntoView(false);
                });
            }            
        } else {
            if(elHS==searchPreviewWindowFixed){
                elHS.classList.remove('flex');
                searchsettings.classList.add('active_button');
            }
            elHS.classList.remove('slidein');
            elHS.classList.add('slideout');
        }
    }
    runfunc
}

function changeVerseAlignment() {
    let styleID = 'verse_alignement'
    if (verseAlignmentStyleSheet = document.querySelector('head style#' + styleID)) {
        verseAlignmentStyleSheet.remove()
    } else {
        let styleRule = `.verse {
        display: block;
    }`;
        createNewStyleSheetandRule(styleID, styleRule)
    }
}

function hideSearchParameters(arr) {
    searchparameters.classList.toggle('hidesearchparameters');
    if (hidesearchparameters.innerText != '▼') {
        hidesearchparameters.innerHTML = '▼'
    } else {
        hidesearchparameters.innerHTML = '▲'
    }
}