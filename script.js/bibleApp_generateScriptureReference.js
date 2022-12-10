var versesOT = 23145;
var versesNT = 7957;
var versesTotal = 31102;

var currentBook, currentBookName, currentChapter;

// Populate Select Lists with Layouts and Categories from JSON file
var selectBooks = document.querySelector('#bible_books');
var selectChapters = document.querySelector('#bible_chapters');
var selectVerse = document.querySelector('#bible_verses');
var ppp = document.querySelector('#ppp');

var goto; //to determine if clicking on chapter number shows only the chapter or scrolls to the chapter
function createChaptersVerses(xxx, yyy) {
    //Clear the chapters refnav pane
    selectVerse.querySelectorAll('*').forEach(element => {
        element.remove();
    });
    getTextOfChapter(xxx, yyy);
}

function getTextOfBook(xxx) {
    getTextOfChapter(xxx, 0)
}

//ON CLICK OF CHAPTER, CLEAR PAGE IF NOT ALREADY PRESENT
function clearPageIfChapterNotPresent(xxx) {
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    chStartIdx = Number(xxx.getAttribute("chapterStartIndex"));
    chEndIdx = Number(xxx.getAttribute("chapterendindex")) + 1;
    bookName = xxx.getAttribute("bookname");

    currentBookName = bookName;
    bkid = Number(xxx.getAttribute("bookindex"));
    gotoId = '_' + bkid + '.' + chNumInBk + '.0';

    // IF TEXT IS NOT ALREADY ON PAGE, JUST SCROLL TO IT
    if (!document.getElementById(gotoId)) {
        ppp.replaceChildren();
    }
}

// GENERATE THE TEXT/VERSES OF THE SELECTED CHAPTER
function getTextOfChapterOnScroll(xxx, prependORnot, adjustScrolling) {
    var old_scrollheight = main.scrollHeight; //store document height before modifications
    let wholeChapterFragment = new DocumentFragment();
    wholeChapterFragment.prepend(generateChapter(xxx));
    prependORappendChapters(prependORnot, wholeChapterFragment);
    // getBksChptsNum(clickCurrentBook(xxx).book);
    if (adjustScrolling) {
        main.scrollTo(0, main.scrollHeight - old_scrollheight)
    }
}

function getTextOfChapter(xxx, oneChptAtaTime = 1, prependORnot, freshClick = false, shouldBrowserHistoryBeUpdated = true) {
    // console.log('gotoId')
    chNumInBk = Number(xxx.getAttribute("chapterindex"));
    bkid = Number(xxx.getAttribute("bookindex"));
    bookName = xxx.getAttribute("bookname");
    currentBookName = bookName;
    // setItemInLocalStorage('lastBookandChapter', 'book_' + bkid + ',' + xxx.getAttribute("value") + ',' + bookName);
    // clickCurrentBook(xxx);
    let gotoId = '_' + bkid + '.' + chNumInBk + '.0'; // console.log(chNumInBk + ' ' + bkid + ' ' + bookName + ' ' + gotoId)

    // IF TEXT IS ALREADY ON PAGE, JUST SCROLL TO IT
    if (document.getElementById(gotoId)) {
        scrollToVerse(document.getElementById(gotoId));
    }
    // TEXT NOT ALREADY ON PAGE, SO FRESHLY GENERATE THE CONTENT
    else {
        if (oneChptAtaTime) {
            ppp.replaceChildren();
        } //will only contain one chapter at a time
        let wholeChapterFragment = new DocumentFragment();
        if (freshClick) {
            getPrevNextChapter(xxx, wholeChapterFragment);
            prependORappendChapters(prependORnot, wholeChapterFragment);
        } else {
            wholeChapterFragment.prepend(generateChapter(xxx));
            prependORappendChapters(prependORnot, wholeChapterFragment);
        }
        // console.log(gotoId)
        scrollToVerse(document.getElementById(gotoId));
        if (shouldBrowserHistoryBeUpdated) {
            updateRefBrowserHistory(bookName + ' ' + (Number(chNumInBk) + 1))
        }
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
    indicateThatVerseHasNoteInJSONnotes_file()//This indicates verses with notes in the database
    // indicateThatVerseHasNoteInIndxDB();
}

function prependORappendChapters(prependORnot, what_to_append) {
    if (!prependORnot) {
        ppp.appendChild(what_to_append);
    } else {
        ppp.prepend(what_to_append);
    }
}

function getPrevNextChapter(prvORnxtChpt, appendHere) {
    //Is prevChapter on page
    if (prvORnxtChpt.previousElementSibling) {
        // console.log('previousElementSibling')

        let prevChapter = prvORnxtChpt.previousElementSibling;
        let prev_chNumInBk = Number(prevChapter.getAttribute("chapterindex"));
        let prev_bkid = Number(prevChapter.getAttribute("bookindex"));
        let prev_gotoId = '_' + prev_bkid + '.' + prev_chNumInBk + '.0';
        if (!document.getElementById(prev_gotoId)) {
            appendHere.append(generateChapter(prevChapter));
        }
    }
    appendHere.append(generateChapter(prvORnxtChpt));
    //Is nextChapter on page
    if (prvORnxtChpt.nextElementSibling) {
        let nextChapter = prvORnxtChpt.nextElementSibling;
        let nxt_chNumInBk = Number(nextChapter.getAttribute("chapterindex"));
        let nxt_bkid = Number(nextChapter.getAttribute("bookindex"));
        let nxt_gotoId = '_' + nxt_bkid + '.' + nxt_chNumInBk + '.0';
        if (!document.getElementById(nxt_gotoId)) {
            appendHere.append(generateChapter(nextChapter));
        }
    }
}

function generateChapter(xyz) {
    let wholeChapterFragment = new DocumentFragment();
    let chpHeadingFragment = new DocumentFragment();
    let chapterHeading = null;
    let chpVersesFragment = new DocumentFragment();
    let chapterVersesSpan = document.createElement('SPAN');
    let xyz_bookName = xyz.getAttribute("bookname");
    let xyz_bookIdx = Number(xyz.getAttribute("bookindex"));
    let xyz_chNumInBk = Number(xyz.getAttribute("chapterindex"));
    let actualChapter = window[versionsToShow[0]][xyz_bookName][xyz_chNumInBk];
    currentlyParsedVersion = versionsToShow[0];
    // let actualChapter = KJV[xyz_bookName][xyz_chNumInBk];
    for (vNumInChpt = 1, i = 0; i < actualChapter.length; i++, vNumInChpt++) {
        // Create Chapter Heading
        if (vNumInChpt == 1) {
            chapterHeading = document.createElement('h2');
            chapterHeading.classList.add('chptheading');
            chapterHeading.setAttribute('bookName', xyz_bookName);
            chapterHeading.append(xyz_bookName + ' ' + (xyz_chNumInBk + 1));
            chapterHeading.id = '_' + xyz_bookIdx + '.' + (xyz_chNumInBk);
            chpHeadingFragment.prepend(chapterHeading)
        }
        let verseContent = actualChapter[i];
        parseSingleVerse(xyz_bookIdx, xyz_chNumInBk, vNumInChpt, verseContent, chpVersesFragment, xyz_bookName, i)
    }
    chapterVersesSpan.classList.add('chptverses');
    chapterVersesSpan.setAttribute('bookName', xyz_bookName);
    chapterVersesSpan.setAttribute('bookId', xyz_bookIdx);
    chapterVersesSpan.setAttribute('chapter', xyz_chNumInBk + 1);
    chapterVersesSpan.append(chpVersesFragment);
    wholeChapterFragment.append(chapterVersesSpan);
    wholeChapterFragment.prepend(chpHeadingFragment);
    currentlyParsedVersion = null;
    return wholeChapterFragment;
    // chpVersesFragment.prepend(chpHeadingFragment);
    // return chpVersesFragment;
}

// let restartRed;
let currentlyParsedVersion = null;
let versionWithRedWordsArray = [];

function parseVerseText(vT, verseSpan) {

    if (Array.isArray(vT)) {
        previousVT=vT;
        vTLength = Object(vT).length;
        let redWordFRAG, redWordSpan, startRed, endRed, restartRed, italicStart=false, italicEnd=true;
        let italicElm;
        vT.forEach((wString, i) => {
            let wordSpan = document.createElement('span');
            let wordSpan1 = document.createElement('span');
            let wordSpan2 = document.createElement('span');
            // For making words of Christ red, for versions that have it, e.g., WEB. (The WEB translation however has issues so I do not use it)
            if (/^""/.test(wString[0]) || (restartRed && versionWithRedWordsArray.includes(currentlyParsedVersion))) {
                startRed = true;
                redWordFRAG = new DocumentFragment()
                redWordSpan = document.createElement('span');
                redWordSpan.classList.add('red');
                /* To ensure it only applies the red word span accross multiple verses for the same translation */
                if (!versionWithRedWordsArray.includes(currentlyParsedVersion)) {
                    versionWithRedWordsArray.push(currentlyParsedVersion);
                }
            };
            if (/""$/.test(wString[0])) {
                endRed = true;
                removeItemFromArray(currentlyParsedVersion, versionWithRedWordsArray)
            };


            if (wString.length == 3) {
                if (wString[2].includes('/')) { //For words such as ["וְ/כָל","Hc/H3605","HC/Ncmsc"]
                    let splt_L = wString[2].split('/');
                    wordSpan1.setAttribute('TH', splt_L[0]);
                    wordSpan2.setAttribute('TH', splt_L[1]);
                } else {
                    wordSpan.setAttribute('TH', wString[2]);
                }
            }
            if (wString.length >= 2) {
                if (wString[0].includes('/')) { //For words such as ["וְ/כָל","Hc/H3605","HC/Ncmsc"]
                    let splt_L = wString[0].split('/')

                    wordSpan1.classList.add('translated');
                    wordSpan1.setAttribute('data-xlit', "");
                    wordSpan1.setAttribute('data-lemma', "");
                    wordSpan1.setAttribute('strnum', wString[1].split('/')[0]);
                    wordSpan1.setAttribute('data-kjv-trans', ' ' + splt_L[0]);
                    wordSpan1.setAttribute('translation', ' ' + splt_L[0]);
                    wordSpan1.innerHTML = splt_L[0];
                    versespanAppender([' ', wordSpan1]);

                    wordSpan2.classList.add('translated');
                    wordSpan2.setAttribute('data-xlit', "");
                    wordSpan2.setAttribute('data-lemma', "");
                    wordSpan2.setAttribute('strnum', wString[1].split('/')[1]);
                    // wordSpan2.classList.add(wString[1].split('/')[1]);
                    wordSpan2.setAttribute('data-kjv-trans', ' ' + splt_L[1]);
                    wordSpan2.setAttribute('translation', ' ' + splt_L[1]);
                    wordSpan2.innerHTML = splt_L[1];
                    versespanAppender([wordSpan2]);
                } else {
                    // The actual translated text
                    wStringREGEXED = wString[0];
                    
                    italicsStartnEnd(wStringREGEXED)
                    
                    wStringREGEXED = wStringREGEXED.replace(/\{/g, '<sup>');
                    wStringREGEXED = wStringREGEXED.replace(/\}/g, '</sup>');
                    wStringREGEXED = wStringREGEXED.replace(/(^"")|(^")/g, '“');
                    wStringREGEXED = wStringREGEXED.replace(/(""$)|"$/g, '”');
                    
                    // Create its "SPAN" container and set attributes as needed 
                    if (wString[1] != 'added') {//If it has an actual strongs number
                        wordSpan.classList.add('translated');
                        wordSpan.setAttribute('data-xlit', "");
                        wordSpan.setAttribute('data-lemma', "");
                        wordSpan.setAttribute('strnum', wString[1]);
                        // wordSpan.classList.add(wString[1]);
                        wordSpan.setAttribute('data-kjv-trans', ' ' + wStringREGEXED);//add the actual translation as an attribute
                        wordSpan.setAttribute('translation', ' ' + wStringREGEXED);//add the actual translation as an attribute
                        // If it is a Title to a Psalm (**they are in italics in the original document, ABP in particular)
                        if(italicStart==true && italicEnd==false){
                            wordSpan.classList.add('em');
                        }
                        if(italicStart==true && italicEnd==true){
                            italicStart=false;
                            // console.log(wStringREGEXED)
                            wordSpan.classList.add('em');
                            wStringREGEXED=wStringREGEXED+'<hr>'
                        }
                    }

                    // Add the text to the "SPAN" element
                    wordSpan.innerHTML = wStringREGEXED;
                    // Add the "SPAN" element with text in it to the current verse
                    versespanAppender([' ', wordSpan]);
                }
            }
            if (wString.length == 1) {
                let spacebtwwords = ' ';
                // Check if last string of string is a punctuation that should be followed by a space
                if (([".", ",", ":", ";", "?", "]"].includes(wString[0][0]) == true)) {
                    spacebtwwords = '';
                }

                if (wString[0].match(/\{\d\}/)) {// ABP word order number
                    spacebtwwords = ' ';
                    wStringREGEXED = wString[0];
                    wStringREGEXED = wStringREGEXED.replace(/\{/g, '<sup>');
                    wStringREGEXED = wStringREGEXED.replace(/\}/g, '</sup>');
                    // italicsStartnEnd(wStringREGEXED)
                    verseSpan.append(' ');
                    // if(italicStart==true && italicEnd==false){
                    //         wordSpan.classList.add('em');
                    // }
                    // if(italicStart==true && italicEnd==true){
                    //     italicStart=false;
                    //     console.log(wStringREGEXED)
                    //     wordSpan.classList.add('em');
                    //     wStringREGEXED=wStringREGEXED+'<hr>'
                    // }

                    verseSpan.innerHTML=verseSpan.innerHTML+wStringREGEXED;
                } else {
                    wStringREGEXED = wString[0];
                    //Opening and closing quotations marks
                    wStringREGEXED = wStringREGEXED.replace(/(^"")|(^")/g, '“');
                    wStringREGEXED = wStringREGEXED.replace(/(""$)|"$/g, '”');
                    italicsStartnEnd(wStringREGEXED)
                    if(italicStart==true && italicEnd==false){
                        console.log('italicsStartnEnd')
                        wordSpan.append(wStringREGEXED);
                        wordSpan.classList.add('em');
                    }
                    if(italicStart==true && italicEnd==true){
                        italicStart=false;
                        wStringREGEXED = wStringREGEXED.replace(/<ii>/g, '')
                        wordSpan.append(wStringREGEXED);
                        wordSpan.append(document.createElement('hr'));
                        wordSpan.classList.add('em');
                        wStringREGEXED=wordSpan;
                    }
                    if (startRed) {
                        redWordFRAG.append(spacebtwwords);
                        redWordFRAG.append(wStringREGEXED);
                        // redWordFRAG.innerHTML=redWordFRAG.innerHTML+wStringREGEXED;
                    } else {
                        verseSpan.append(spacebtwwords);
                        verseSpan.append(wStringREGEXED);
                        // verseSpan.innerHTML=verseSpan.innerHTML+wStringREGEXED;
                    }
                }
                
            }
            // if(/<\/i>/i.test(wStringREGEXED)){
            //     console.log('emE')
            // }
            verseSpan.innerHTML = verseSpan.innerHTML.replace(/<\/sup> /g, '</sup>');
            // if (i == vT.lenth - 1) {
            //     console.log(wString)
            // }
        });
        function italicsStartnEnd(wStringREGEXED){
            italicStart
            italicEnd
            if((italicStart==false)&&(/<i>/i.test(wStringREGEXED))){
                // console.log('emS')
                italicStart=true;
                italicEnd=false;
                wStringREGEXED = wStringREGEXED.replace(/<i>/g, '');
            }
            if(/<ii>/i.test(wStringREGEXED)){
                // console.log('emE')
                // console.log(wStringREGEXED)
                italicEnd=true;
                wStringREGEXED = wStringREGEXED.replace(/<ii>/g, '');
                // console.log(wStringREGEXED)
            }
        }
        function versespanAppender(arr) {
            if (redWordFRAG) {
                arr.forEach(a => {
                    redWordFRAG.append(a)
                })
                restartRed = false;
                if (endRed || i == vTLength - 1) {
                    redWordSpan.append(redWordFRAG);
                    verseSpan.append(redWordSpan);
                    endRed = null;
                    startRed = null;
                    if (i == vTLength - 1) {
                        restartRed = true;
                    }
                }
            } else {
                arr.forEach(a => {
                    verseSpan.append(a)
                })
            }
        }
    } else {
        // console.log(previousVT)
        // console.log(vT)
        // if (/'missing'/.test(vT)){console.log(vT)}
        vT = vT.replace(/<hi type="bold">/g, '<span class="b">');
        vT = vT.replace(/<hi type="italic">/g, '<span class="i">');
        vT = vT.replace(/<\/hi>/g, '</span>');
        vT = vT.replace(/<ptitle>/g, '<span class="em">');
        vT = vT.replace(/<\/ptitle>/g, '</span><hr>');
        // vT = vT.replace(/^""/g, '<span class="red">');
        // vT = vT.replace(/""/g, '</span>');
        vT = modifyQuotationMarks(vT);
        vT = vT.replace(/ ,/g, ',');
        verseSpan.innerHTML = vT;
    }
    
    return verseSpan;
}

function parseSingleVerse(bkid, chNumInBk, vNumInChpt, vText, appendHere, bookName, vIdx, fromSearch = false, bibleVersionName) {
    let verseMultipleSpan = document.createElement('span');
    verseMultipleSpan.classList.add('vmultiple')
    let verseSpan = document.createElement('span');
    let verseNum = document.createElement('code');
    // let bereanIndex = jsonVerseIdex - versesOT;/* TO BE CHANGED */

    // let parsedVerse = new DocumentFragment();
    if (vText == null && bibleVersionName) {
        vText = window[bibleVersionName][bookName][chNumInBk - 1][vNumInChpt - 1];
    }

    if (fromSearch) {
        let trans_lang;
        if (bibleVersionName) {
            trans_lang = bible.Data.supportedVersions[bibleVersionName].language;
        }
        verseSpan = parseVerseText(vText, verseSpan);
        if (bibleVersionName) {
            verseSpan.classList.add(`v_${bibleVersionName}`);
            verseSpan.classList.add(`hello_there`);
            if (bible.isRtlVersion(bibleVersionName, bookName) == true) {
                verseSpan.classList.add('rtl');
                verseNum.prepend(document.createTextNode(`${(chNumInBk + 1)}:${vNumInChpt} ${bibleVersionName}`));
            } else {
                verseNum.prepend(document.createTextNode(`${bibleVersionName} ${(chNumInBk)}:${vNumInChpt} `));
            }
        } else {
            verseNum.prepend(document.createTextNode((chNumInBk) + ':' + vNumInChpt + ' '));
            // verseSpan.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (vNumInChpt - 1));
        }
        verseNum.setAttribute('ref', bookName + ' ' + (chNumInBk) + ':' + vNumInChpt);
        verseNum.setAttribute('aria-hidden', 'true'); //so that screen readers ignore the verse numbers
        verseSpan.prepend(verseNum);

        createTransliterationAttr(verseSpan, trans_lang);
        verseSpan.classList.add('verse');
        appendHere.appendChild(verseSpan);
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
        return
    }
    // /* OTHER VERSIONS */
    if (versionsToShow.length != 0) {
        versionsToShow.forEach(bv2d => {
            currentlyParsedVersion = bv2d;
            let trans_lang = bible.Data.supportedVersions[bv2d].language;
            // console.log(window[bv2d][bookName][chNumInBk][vIdx])
            let verseSpan2 = document.createElement('span');
            let verseNum2 = document.createElement('code');
            // console.log(versionsToShow)
            // console.log(window[bv2d])
            let vText2 = window[bv2d][bookName][chNumInBk][vIdx]
            verseSpan2 = parseVerseText(vText2, verseSpan2);
            verseSpan2.classList.add(`v_${bv2d}`)

            verseNum2.setAttribute('ref', bookName + ' ' + (chNumInBk + 1) + ':' + vNumInChpt);
            verseNum2.setAttribute('aria-hidden', 'true'); //so that screen readers ignore the verse numbers
            verseSpan2.prepend(verseNum2);
            verseSpan2.classList.add('verse');
            if (bible.isRtlVersion(bv2d, bookName) == true) {
                verseSpan2.classList.add('rtl');
                verseNum2.prepend(document.createTextNode(`${(chNumInBk + 1)}:${vNumInChpt} ${bv2d}`));
            } else {
                verseNum2.prepend(document.createTextNode(`${bv2d} ${(chNumInBk + 1)}:${vNumInChpt} `));
            }
            // verseSpan2.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (vNumInChpt - 1));
            createTransliterationAttr(verseSpan2, trans_lang);
            verseMultipleSpan.appendChild(verseSpan2);
            verseMultipleSpan.id = ('_' + bkid + '.' + (chNumInBk) + '.' + (vNumInChpt - 1));
        })
    }
    appendHere.appendChild(verseMultipleSpan);
    currentlyParsedVersion = null;
    return appendHere
}
// function getTextOfVerse(xxx) {
//     vIdx = xxx.getAttribute("verseIndex")
//     ppp.append(bcv_kjv[Number(vIdx)].text)
// }