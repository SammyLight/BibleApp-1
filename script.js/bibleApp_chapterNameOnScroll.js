/* GET TOPMOST H2*/
main.addEventListener('scroll', getHighestVisibleH2)

function getHighestVisibleH2() {
    let hH = null;

    function highestElmFromMainTop(distanceFromMainTop = 0) {
        let higestElm = null;
        while (higestElm == null || (!higestElm.matches('.chptheading') && (!higestElm.matches('.chptverses') || elmAhasElmOfClassBasAncestor(higestElm, 'chptverses')) && distanceFromMainTop < 10)) {
            distanceFromMainTop++;
            higestElm = document.elementFromPoint(main.getBoundingClientRect().x + (main.getBoundingClientRect().width / 2), main.getBoundingClientRect().y + distanceFromMainTop);
        }
        return higestElm
    }
    let higestElm = highestElmFromMainTop();

    if (higestElm.matches('.chptheading')) {
        hH = higestElm;
    } else if (higestElm.matches('.chptverses')) {
        hH = higestElm.previousElementSibling;
    } else if (elmAhasElmOfClassBasAncestor(higestElm, 'chptverses')) {
        higestElm = elmAhasElmOfClassBasAncestor(higestElm, 'chptverses');
        hH = higestElm.previousElementSibling;
    }
    if (hH != null && hH.matches('.chptheading') && hH.innerText != reference.value) { showCurrentChapterInHeadnSearchBar(hH) }

}

function showCurrentChapterInHeadnSearchBar(h, isH2 = true) {
    //Change reference in reference search box
    let derivedReference, hID;
    if (isH2) {
        derivedReference = h.innerText;
        hID = h.id.split('_')[1];
    } else {
        derivedReference = `${h.getAttribute('bookname')} ${h.getAttribute('chapter')}`;
        hID = `${h.getAttribute('bookid')}.${Number(h.getAttribute('chapter'))-1}`;
    }

    //To indicate the selected current chapter

    let selectedChapter = bible_chapters.querySelector(`[value="bk${hID.split('.')[0].toString()}ch${Number(hID.split('.')[1])}"]`)
    let bkName = bible_books.querySelector(`[bookname="${h.getAttribute('bookname')}"]`);
    indicateBooknChapterInNav(bkName, selectedChapter);

    reference.value = derivedReference;
    //Make current chapter page title
    document.querySelector('head>title').innerText = /*'LightCity-' +  */ derivedReference
}

/* REMOVE HIGHEST AND LOWEST CHAPTERS VERSES */
function remove_HIGHEST_Chapter() {
    if (main.querySelectorAll('.chptheading').length >= 4) {
        let highestChapterHeading = main.querySelector('.chptheading:first-of-type');
        let highestChapterID = highestChapterHeading.id;
        let highestChapterBookName = highestChapterHeading.getAttribute('bookname');
        let hCidSplit = highestChapterID.split('.');
        let chapterNum = Number(hCidSplit[1]) + 1;
        let elmToRemove = main.querySelector('[bookname="' + highestChapterBookName + '"][chapter="' + chapterNum + '"]')
        highestChapterHeading.remove();
        elmToRemove.remove();
    }
}

function remove_LOWEST_Chapter() {
    if (main.querySelectorAll('.chptheading').length >= 4) {
        let lowestChapterHeading = main.querySelector('.chptheading:last-of-type');
        let lowestChapterID = lowestChapterHeading.id;
        let lowestChapterBookName = lowestChapterHeading.getAttribute('bookname');
        let lCidSplit = lowestChapterID.split('.');
        let chapterNum = Number(lCidSplit[1]) + 1;
        let elmToRemove = main.querySelector('[bookname="' + lowestChapterBookName + '"][chapter="' + chapterNum + '"]')
            //ScrollHeight is affected by removal of chapters
            //So, making adjustments for it
        let old_scrollheight = main.scrollHeight;
        lowestChapterHeading.remove();
        elmToRemove.remove();
        main.scrollTo(0, main.scrollHeight - old_scrollheight)
    }
}

//TO LOAD NEW CHAPTER WHEN CHAPTER HAS BEEN SCROLLED TO THE END
function moreChaptersOnScroll() {
    main.addEventListener('scroll', loadNewChapterOnScroll)
}

function showOnlyLoadedChapters() {
    main.removeEventListener('scroll', loadNewChapterOnScroll)
}
moreChaptersOnScroll()
let prev_bkNumb = null;

function loadNewChapterOnScroll() {
    let lastScrollTop = 0;
    var mst = main.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (mst > lastScrollTop) {
        // downscroll code
        if (main.scrollHeight - main.scrollTop - main.clientHeight < 100) { //If you have scrolled to the end of the element
            let lastChapter = main.querySelector('.chptverses:last-of-type');
            bkNumb = lastChapter.getAttribute('bookid');
            let chptNumb = lastChapter.getAttribute('chapter') - 1;
            // let nextChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)+1}"]`)//Stops generating chapters at end of book
            let nextChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)}"]`).nextElementSibling;

            if (nextChapter) {
                remove_HIGHEST_Chapter();
                getTextOfChapterOnScroll(nextChapter, 0);
                indicateThatVerseHasNoteInJSONnotes_file();
            }
            transliteratedWords_Array.forEach(storedStrnum => {
                showTransliteration(storedStrnum)
            });
        }
    } else {
        // upscroll code
        if (main.scrollTop < 10) { //If you have scrolled to the top of the element
            let firstChapter = main.querySelector('.chptverses:first-of-type')
            bkNumb = firstChapter.getAttribute('bookid');
            let chptNumb = firstChapter.getAttribute('chapter') - 1;
            // let prevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)-1}"]`)//Stops generating chapters when scrolling gets to the beginning of book
            let prevChapter = bible_chapters.querySelector(`[value="bk${bkNumb}ch${Number(chptNumb)}"]`).previousElementSibling
            if (prevChapter) {
                remove_LOWEST_Chapter()
                getTextOfChapterOnScroll(prevChapter, true, true);
                indicateThatVerseHasNoteInJSONnotes_file();
            }
        }
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
    // For Mobile or negative scrolling
    lastScrollTop = mst <= 0 ? 0 : mst;
    //to style verse references that have notes in the database
    // indicateThatVerseHasNoteInIndxDB()
}

/* Scroll To Target Verse */
function scrollToVerse(targetVerse) {
    if (targetVerse.parentElement.classList.contains('vmultiple')) {
        targetVerse = targetVerse.parentElement
    } //When verse is put in a verse holder for multiple verses
    if (targetVerse) {
        if (!targetVerse.previousElementSibling) { //(if no previous-sibling, then it must be the first verse so) scroll to parents sibling (which should be the heading)
            targetVerse.parentElement.previousElementSibling.scrollIntoView()
        } else {
            // targetVerse.previousElementSibling.scrollIntoView({
            targetVerse.scrollIntoView({
                // behavior: "smooth"//sometimes does not land on the element properly
            });
        }
    }
}

function checkVisible(elm) {
    //From: https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= -10);
}