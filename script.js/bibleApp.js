//GENERATE ALL CHAPTERS IN A BOOK ON DOUBLE-CLICKING IT
document.addEventListener("dblclick", function (e) {
    // goto=0;
    let dbl_clickedElm = e.target;
    //To DISPLAY THE TEXT OF ALL CHAPTERS IN A BOOK
    if (dbl_clickedElm.classList.contains('bkname')) {
        getAllChapters(dbl_clickedElm);
        indicateBooknChapterInNav(dbl_clickedElm)
    }
    //Highlight and Unhighlight verse
    if (dbl_clickedElm.classList.contains('verse')) {
        if (!dbl_clickedElm.classList.contains('vhlt')) {
            dbl_clickedElm.classList.add('vhlt')
        } else {
            dbl_clickedElm.classList.remove('vhlt')
        }
    }
})
function getAllChapters(dbl_clickedElm) {
    // let startTime = performance.now() //to get how long it takes to run
    //To populate chapter verse numbers refnav pane
    if (dbl_clickedElm.getAttribute('bookindex') != currentBook) {
        bible_chapters = document.getElementById('bible_chapters');
        allBookChapters = bible_chapters.querySelectorAll('.show_chapter');
        ppp.innerHTML = '';
        allBookChapters.forEach(elm => {
            getTextOfBook(elm)
        });
        currentBook = dbl_clickedElm.getAttribute('bookindex');
        currentBookName = dbl_clickedElm.getAttribute('bookname');
        let targetVerse = document.getElementById(`_${currentBook}.0.0`); //scroll to first verse of book
        scrollToVerse(targetVerse);
        showCurrentChapterInHeadnSearchBar(ppp.querySelector('h2').innerText);
        goto = 1;
    }
    // let endTime = performance.now();
    // console.log(`Duration: ${endTime - startTime} milliseconds`)
}
// ppp.addEventListener("scroll", realine) //for Scripture Text Highligher
function realine() {} //This empty