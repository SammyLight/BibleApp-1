//Settings under refnav.
cache_strongs.addEventListener('change', function() {
    if (this.checked) {
        localStorage.removeItem('transliteratedWords')
    }
});
cache_higlights.addEventListener('change', function() {
    if (this.checked) {
        localStorage.removeItem('strongsHighlightStyleSheet')
    }
});
let defaultReference; //For browser history
versionsToShow = ['KJV'];

function cacheFunctions() {
    versionsToShow2 = versionsToShow;
    if (localStorage.getItem('versionsToShow')) {
        let versionsToDisplay = localStorage.getItem('versionsToShow').split(',');
        versionsToShow = versionsToDisplay;
        versionsToShow2 = versionsToShow;
    }
    /* LOAD SAVED BIBLE VERSEIONS */
    if (localStorage.getItem('loadedBibleVersions')) {
        let versionsToBeLoaded = localStorage.getItem('loadedBibleVersions').split(',');
        versionsToBeLoaded.forEach(version => {
            versionID = version + '_version';
            //To indicate the book has been loaded
            document.querySelector('#' + versionID).checked = true;
            loadVersion(version); //To load the book
        });
    }
    /* Load the KJV as default translation if no previously selected version */
    else {
        //To indicate the book has been loaded
        document.querySelector('#KJV_version').checked = true;
        //To load the book
        loadVersion('KJV');
    }
    if (localStorage.getItem('strongsHighlightStyleSheet')) {
        let hlstrngCSS = localStorage.getItem('strongsHighlightStyleSheet');
        let headPart = document.getElementsByTagName('head')[0];
        newStyleInHead = document.createElement('style');
        newStyleInHead.id = 'highlightstrongs';
        newStyleInHead.innerHTML = hlstrngCSS = hlstrngCSS.split(',').join('');
        headPart.append(newStyleInHead);
        hlstrngCSS = hlstrngCSS.split(',').join('');
    }
    if (localStorage.getItem('showVersesInSearch')) {
        let showVerseCheck = localStorage.getItem('showVersesInSearch');
        if (showVerseCheck == 'yes') {
            showreturnedverses.check = true
        } else if (showVerseCheck == 'no') {
            showreturnedverses.checked = false
        }
    }

    if (localStorage.getItem('styles_variables')) {
        let stylesVariablesArray = localStorage.getItem('styles_variables').split(',');
        stylesVariablesArray.forEach((sVar, i) => {
            j = i + 2;
            if (j % 2 == 0) {
                document.querySelector(':root').style.setProperty(stylesVariablesArray[i], stylesVariablesArray[i + 1]);
            }
        });
    }
    if (localStorage.getItem('versionHighlightingOnHover')) {
        versionHighlight_ON_OFF(localStorage.getItem('versionHighlightingOnHover'))
    } else {
        //for the first time the app is run on a browser (it will turn it on)
        versionHighlight_ON_OFF(true)
    }
    //For showing original english translation beside Hebrew/Greek transliteration
    // This really has nothing to do with the cache
    engnXlit_supscript('eng')
}

function cacheFunctions2() {
    runCacheFunc2 = false;
    versionsToShow.forEach(versionName => {
        document.querySelector('[bversion="' + versionName + '"]').click();
    })
    if (localStorage.getItem('lastBookandChapter')) {
        lastOpenedBook = localStorage.getItem('lastBookandChapter').split(',')[0];
        lastOpenedChapter = localStorage.getItem('lastBookandChapter').split(',')[1];
    }
    /* Default chapter Gen 1 */
    else {
        lastOpenedBook = 'book_1';
        lastOpenedChapter = 'bk1ch1';
    }
    document.querySelector('.bkname[value="' + lastOpenedBook + '"]').click()
    getTextOfChapter(bible_chapters.querySelector('.chptnum[value="' + lastOpenedChapter + '"]'));
    defaultReference = lastOpenedBook + ' ' + lastOpenedChapter;
    if (localStorage.getItem('transliteratedWords')) {
        transliteratedWords_Array = localStorage.getItem('transliteratedWords').split(',');
        transliteratedWords_Array.forEach(storedStrnum => {
            showTransliteration(storedStrnum)
        });
    }
}

function setItemInLocalStorage(name, nValue) {
    if (name == 'transliteratedWords' && !cache_strongs.checked) { //check if in the settings saving to cache for the transliteration words is selected
        localStorage.setItem(name, nValue);
    } else if (name == 'strongsHighlightStyleSheet' && !cache_higlights.checked) {
        localStorage.setItem(name, nValue);
    } else {
        localStorage.setItem(name, nValue);
    }
}

// function removeFromLocalStorage() {}