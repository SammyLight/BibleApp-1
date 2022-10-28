function loopThroughBibleBooks() {
    let booksList = bible.Data.bookNamesByLanguage.en;
    let booksLength = booksList.length;

    let bookName = null,
        bookStartIndex = null,
        bookEndIndex = null,
        numberOfChapters = null;

    //Loop through booksList
    let abc = 0;
    let allBooksWithContentInVersion = KJV;
    for (let x = 0; x < booksLength; x++) {
        let bookNameInVersion = Object.keys(allBooksWithContentInVersion)[x];
        bookName = bookNameInVersion;
        let allChaptersInCurrentBook = allBooksWithContentInVersion[bookName];

        //Loop through Chapters
        let numberOfChapters = allChaptersInCurrentBook.length;
        for (y = 0; y < numberOfChapters; y++) {
            let currentChapter = allChaptersInCurrentBook[y];
            let allVersesInCurrentChapter = currentChapter;
            let chapterVersesLength = currentChapter.length;
            // for (z = 0; z < chapterVersesLength; z++) {
            //     currentChapter;
            //     let currentVerse = allVersesInCurrentChapter[z];
            //     abc++;
            //     // console.log(`${bookNameInVersion}[${y}][${z}]`)
            // }
            if (searchForStrongs == true) {
                //If there is a strongs num to be searched for, then you cannot search for a phrase. Rather search for to see if verse contains all words
                let wordsArray = arrayOfWordsToSearchFor(wordsearch.value).wordsArray;
                for (z = 0; z < chapterVersesLength; z++) {
                    let containsAll = true;
                    //Strip off {}[] and strongs numbers
                    let originalText = allVersesInCurrentChapter[z];
                    for (let j = 0; j < wordsArray.length; j++) {
                        if (!originalText.includes(wordsArray[j])) {
                            containsAll = false;
                            break
                        }
                        //IT WILL ONLY CHECK AT THE END OF THE FOR LOOP WHICH IT WILL NOT GET TO IF ALL WORDS ARE NOT INCLUDED IN THE VERSE.TXT
                        if (j == wordsArray.length - 1) {
                            if ((prevBook != currentBK) || (prevBook == null)) {
                                prevBook = currentBK;
                            }
                            currentBK = bookName;
                            console.log('currentBK')
                            appendVerseToSearchResultWindow(i, currentBK, prevBook);
                            findAnything = true;
                        }
                    }
                }
            } else if (searchForStrongs == false) {
                //If there is no strongs num to be searched for, then just search for the phrase
                let arrayOfSearchWords = arrayOfWordsToSearchFor(wordsearchValue).wordsArray;
                for (z = 0; z < chapterVersesLength; z++) {
                    let originalText = allVersesInCurrentChapter[z];
                    let madePlain = returnStrippedTextOfVerse(originalText).withOutStrongs
                    if (!case_sensitive.checked) {
                        madePlain = madePlain.toLowerCase()
                    }
                    let arrayOfWordsInVerse = madePlain.split(' ');
                    /* PHRASE SEARCH */
                    if (search_phrase.checked) {
                        if (((whole_word.checked) && (isAsubArrayofB(arrayOfSearchWords, arrayOfWordsInVerse))) || ((!whole_word.checked) && (madePlain.search(word2find) != -1))) {
                            if ((prevBook != currentBK) || (prevBook == null)) {
                                prevBook = currentBK;
                            }
                            currentBK = bookName;
                            appendVerseToSearchResultWindow(i, currentBK, prevBook);
                            // console.log(madePlain)
                            findAnything = true;
                        }
                    }
                    /* ALL WORDS (NOT PHRASE) SEARCH */
                    else if (search_all_words.checked) {
                        if (((whole_word.checked) && (areAllitemsOfAinB(arrayOfSearchWords, arrayOfWordsInVerse))) || ((!whole_word.checked) && (areAllitemsOfAinB(arrayOfSearchWords, madePlain)))) {
                            if ((prevBook != currentBK) || (prevBook == null)) {
                                prevBook = currentBK;
                            }
                            currentBK = bookName;
                            appendVerseToSearchResultWindow(i, currentBK, prevBook);
                            // console.log(madePlain)
                            findAnything = true;
                        }
                    }
                }
            }
        }
    }
}

// class Car {
//     constructor(name, year) {
//       this.name = name;
//       this.year = year;
//     }
//     age(x) {
//       return x - this.year;
//     }
//   }

//   let date = new Date();
//   let year = date.getFullYear();

//   let myCar = new Car("Ford", 2014);
//   document.getElementById("demo").innerHTML=
//   "My car is " + myCar.age(year) + " years old.";  