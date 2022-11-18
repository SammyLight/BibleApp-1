//KJV Bible OT & NT
var request_KJV_URL = 'bibles/KJV.json';
var kjvBible = new XMLHttpRequest();
kjvBible.open('GET', request_KJV_URL);
kjvBible.responseType = 'json';
kjvBible.send();

var KJV;

window.onload = function () {
    kjvBible.onload = function () {
        let booksChaptersAndVerses = kjvBible.response;
        KJV = booksChaptersAndVerses['books'];
        populateBooks();
        cacheFunctions() //GET TRANSLITERATED ARRAY FROM CACHE
        // }
    }
}

/* LOAD THE BIBLE */
let availableVersions = {
    // 'original': {name: 'Original', language: 'original'},
    'accented': {name: 'Accented original',language: 'original'},
	'ABP-en': { name: 'Apostolic Bible Polyglot-en', language: 'en' },
	'ABP-gr': { name: 'Apostolic Bible Polyglot-gr', language: 'original' },
    'KJV': {name: 'King James Version',language: 'en'},
    'WEB': {name: 'World English Bible',language: 'en'},
    'ESV': {name: 'English Standard Version',language: 'en'},
    // 'LC': {name: 'Literal Consistent', language: 'en'},
    'YLT': {name: 'Young\'s Literal Translation',ge: 'en'},
    'ASV': {name: 'American Standard Version',language: 'en'},
    'DARBY': {name: 'Darby Translation',language: 'en'},
    'GW': {name: 'God\'s Word Translation',language: 'en'},
    'JUB': {name: 'Jubilee Bible 200',language: 'en'},
    'LEB': {name: 'Lexham English Bible',language: 'en'},
    'NET': {name: 'New English Translation',language: 'en'},
    'WMB': {name: 'World Messianic Bible',language: 'en'},
	// 'GRKV': { name: "Greek LXX and NT-TR", language: 'en' },
    'OPV': {name: 'ترجمه-ی قدام',language: 'fa'},
    'TPV': {name: 'مژده برای اسرع جدید',language: 'fa'},
    'NMV': {name: 'ترجمه هزارۀ نو',language: 'fa'},
    'AraSVD': {name: 'Arabic Bible',language: 'ar'},
    'RomCor': {name: 'Cornilescu Bible in Romanian  language',language: 'ro'},
    'MCSB': {name: 'Matupi Chin Standard Bible',language: 'hlt'},
    'FreSegond1910': {name: "Bible Louis Segond (1910)",language: 'fr'},
    'FreJND': {name: "Bible J.N.Darby en français",language: 'fr'},
    'FrePGR': {name: "Bible Perret-Gentil et Rilliet",language: 'fr'},
    'CKBOKS': {name: "وەشانی بێبەرامبەری کوردیی سۆرانیی ستاندەر",language: 'ckb'},
};
// let original,accented,WEB,ESV,LC,YLT,ASV,DARBY,GW,JUB,LEB,NET,WMB,OPV,TPV,NMV,AraSVD,RomCor,MCSB,FreSegond1910,FreJND,FrePGR,CKBOKS;
// var original='original',accented='accented',WEB='WEB',ESV='ESV',LC='LC',YLT='YLT',ASV='ASV',DARBY='DARBY',GW='GW',JUB='JUB',LEB='LEB',NET='NET',WMB='WMB',OPV='OPV',TPV='TPV',NMV='NMV',AraSVD='AraSVD',RomCor='RomCor',MCSB='MCSB',FreSegond1910='FreSegond1910',FreJND='FreJND',FrePGR='FrePGR',CKBOKS='CKBOKS';

for (key in availableVersions) {
    // 
    // 
    bible_versions.innerHTML = bible_versions.innerHTML + `<div><input type="checkbox" id="${key}_version" name="${key}_version" value="${key}"><label for="${key}_version" abreviation="${key}" title="${availableVersions[key].name}">${key}</label></div>`;
}
bible_versions.addEventListener('change', function (e) {
    // console.log(e.target)
    if ((e.target.checked) && (e.target.parentElement.parentElement.matches('#bible_versions'))) {
        loadVersion(e.target.getAttribute('value'));
        localStorage.setItem('loadedBibleVersions', loadedBibleVersions);
    } else if (!e.target.checked && (e.target.parentElement.parentElement.matches('#bible_versions'))) {
        let versionName = window[e.target.getAttribute('value')];
        versionName = null; //Delete the loaded JSON version
        loadedBibleVersions.splice(loadedBibleVersions.indexOf(versionName), 1)
        if (versionsToShow.length > 0) {
            versionsToShow.splice(versionsToShow.indexOf(versionName), 1);
            localStorage.setItem('versionsToShow', versionsToShow);
        }
        localStorage.setItem('loadedBibleVersions', loadedBibleVersions);
        bibleversions_btns.querySelector(`[bversion="${e.target.getAttribute('value')}"]`).remove();
        if (singleverse_compare_menu) {
            singleverse_compare_menu.querySelector(`[bversion="${e.target.getAttribute('value')}"]`).remove();
        }
    }
});

let bibleVersionsLoadedFromCACHE = [];
let loadedBibleVersions = [];
let versionsToShow = [];
let runCacheFunc2 = true;

function loadVersion(versionName) {
    let request_Version_URL = `bibles/${versionName}.json`;
    let bibleVersion = new XMLHttpRequest();
    bibleVersion.open('GET', request_Version_URL);
    bibleVersion.responseType = 'json';
    bibleVersion.send();

    let newVersion;

    bibleVersion.onload = function () {
        let booksChaptersAndVerses = bibleVersion.response;
        newVersion = booksChaptersAndVerses['books'];
        window[versionName] = newVersion; //For automatically assigning values to the variables        
        /* TO ENSURE THE BOOKS ARE ONLY DISPLAYED AFTER THEY HAVE BEEN LOADED */
        if (runCacheFunc2) {
            if (versionsToShow.includes(versionName.toString())) {
                bibleVersionsLoadedFromCACHE.push(versionName);
            }
            if (versionsToShow2.length == bibleVersionsLoadedFromCACHE.length) {
                cacheFunctions2()
            }
        }
    }
    let bvInpt = document.createElement('INPUT');
    bvInpt.setAttribute('type', 'checkbox');
    let bvBtn = document.createElement('BUTTON');
    bvBtn.setAttribute('bversion', versionName);
    bvBtn.append(bvInpt);
    bvBtn.innerHTML = bvBtn.innerHTML + versionName;
    bibleversions_btns.append(bvBtn);
    singleverse_compare_menu.append(bvBtn.cloneNode(true));
    if (unwantedInputs = singleverse_compare_menu.querySelectorAll('input')) {
        unwantedInputs.forEach(unw => {
            unw.remove()
        })
    }
    if (loadedBibleVersions.indexOf(versionName) == -1) {
        loadedBibleVersions.push(versionName)
    };
}

bibleversions_btns.addEventListener('click', function (e) {
    let pbtn = e.target;
    if (pbtn.matches("[bversion]")) {
        let pbtnCheck = pbtn.querySelector('input');
        let vname = pbtn.getAttribute('bversion');

        if ((pbtnCheck.checked) && (bibleversions_btns.querySelectorAll('[bversion] input:checked').length > 1)) {
            pbtn.classList.remove("active_button");
            pbtnCheck.checked = false;
            //remove the book from the display
            let versionVersesToRemove = document.querySelectorAll(`.v_${vname}`);
            versionVersesToRemove.forEach(v2r => {
                v2r.remove()
            });
            versionsToShow.splice(versionsToShow.indexOf(vname), 1);
            localStorage.setItem('versionsToShow', versionsToShow)
            // re-enable its twin
            if (main.querySelector('#singleverse_compare_menu')) {
                let twinInSingleVerseCompare = singleverse_compare_menu.querySelector('[bversion="' + vname + '"]');
                twinInSingleVerseCompare.disabled = false;
                twinInSingleVerseCompare.classList.remove('active_button');
            }
            //MOVE DE-SELECTED VERSION BELOW SELECTED VERSIONS
            let elm2moveDown = pbtn.cloneNode(true);
            pbtn.remove();
            let elm2precede = bibleversions_btns.querySelector('button:not(.active_button)');
            bibleversions_btns.insertBefore(elm2moveDown, elm2precede);
            // bibleversions_btns.appendChild(elm2moveDown);
        } else if ((!pbtnCheck.checked)) {
            pbtn.classList.add("active_button");
            pbtnCheck.checked = true;
            if (versionsToShow.includes(vname) == 0) {
                versionsToShow.push(vname);
                localStorage.setItem('versionsToShow', versionsToShow)
                //display the book
                let allLoadedmainVerses = main.querySelectorAll('.vmultiple');
                // 
                allLoadedmainVerses.forEach(vrs => {
                    let bkid = vrs.id.split('.')[0];
                    let v_ref = vrs.querySelector('code').getAttribute('ref').split(' ');
                    // 
                    let chptNv = v_ref.pop();
                    let bookName = v_ref.join(' ');
                    chptNv = chptNv.split(':')
                    let chNumInBk = chptNv[0]
                    let vIdx = chptNv[1]
                    // 
                    // 
                    // 
                    let vText = window[vname][bookName][Number(chNumInBk) - 1][Number(vIdx) - 1];
                    let appendHere = vrs;
                    parseSingleVerse(bkid, chNumInBk, vIdx, vText, appendHere, bookName, null, true, vname);
                });
                if (document.querySelector('#singleverse_compare_menu')) {
                    let twinInSingleVerseCompare = singleverse_compare_menu.querySelector('[bversion="' + vname + '"]');
                    twinInSingleVerseCompare.disabled = true;
                    twinInSingleVerseCompare.classList.add('active_button');
                    sverse_comp_backup = singleverse_compare_menu.cloneNode(true);
                }
            }
            //MOVE SELECTED VERSIONS TO THE TOP
            if (bibleversions_btns.querySelector('button:not(.active_button)')) {
                let elm2precede = bibleversions_btns.querySelector('button:not(.active_button)');
                let pbtnClone = pbtn.cloneNode(true);
                pbtn.remove();
                bibleversions_btns.insertBefore(pbtnClone, elm2precede)
            }
        }
    }

})

/* COMPARE SINGLE VERSE */
// function compareThisVerse() {}
let sverse_comp_backup;
let clickedVerseRef, clickedChapterNverse;
function breakDownClickedVerseRef(cvdivider='.', manual_ref) {

    // "manual_ref" is manually inputed reference
    let in_ref;
    if(manual_ref){in_ref=manual_ref}
    else{in_ref=clickedVerseRef}

    let fullRefSplit = in_ref.split(' ');
    let bN, bC, cV, bCnCv;
    bCnCv = fullRefSplit.pop().split(':').join(cvdivider);
    clickedChapterNverse = bCnCv;
    bC = bCnCv.split('.')[0];
    cV = bCnCv.split('.')[1];
    bN = fullRefSplit.join(' ');
    return {
        bCnCv:bCnCv,
        bC:bC,
        cV:cV,
        bN:bN,
        clickedChapterNverse:clickedChapterNverse,
    }
}

//To ensure local versions loader does not load if a verse is double clicked
const add_VersionsLoader_preventDoublick = debounce(local_versionsloader, 300);

//The actual function that adds the local versions loader to the window
function local_versionsloader(e) {
    let clkelm = e.target;
    if (clkelm.matches('#singleverse_compare_menu')) {
        clkelm.remove();
        main.removeEventListener('click', local_versionsloader)
        return
    }
    /* ATTACH VERSE VERSION COMPARE BUTTONS */
    if (clkelm.matches('.verse,.vmultiple')) {
        if (clkelm.querySelector('#singleverse_compare_menu')) {
            clkelm.querySelector('#singleverse_compare_menu').remove();
            main.removeEventListener('click', local_versionsloader)
            return
        }
        clickedVerseRef = clkelm.querySelector('[ref]').getAttribute('ref');
        let sverse_comp;
        if (document.querySelector('#singleverse_compare_menu')) {
            sverse_comp = singleverse_compare_menu.cloneNode(true);
            sverse_comp_backup = singleverse_compare_menu.cloneNode(true);
            document.querySelector('#singleverse_compare_menu').remove();
            disableNenable_compareBtn();
        } else {
            sverse_comp = sverse_comp_backup.cloneNode(true);
            disableNenable_compareBtn();
        }

        function disableNenable_compareBtn() {
            sverse_comp.querySelectorAll('[bversion][disabled]').forEach(vn => {
                vn.disabled = false;
                vn.classList.remove('active_button');
            })
            versionsToShow.forEach(vn => {
                let sverse_comp_btn = sverse_comp.querySelector('[bversion="' + vn + '"]');
                sverse_comp_btn.disabled = true;
                sverse_comp_btn.classList.add('active_button');
            })
            sverse_comp_backup = sverse_comp.cloneNode(true);
            //On change of verse ensure that only versions of that verse are active
            if (hlv = sverse_comp.querySelectorAll('button:not([disabled])')) {
                hlv.forEach(b => {
                    let vn = b.getAttribute('bversion');
                    if (!clkelm.parentElement.querySelector('.v_' + vn)) { //If verse does not have the Version 
                        b.classList.remove('active_button');
                    } else { //If verse has the version
                        b.classList.add('active_button');
                    }
                })
            }
        }
        clkelm.append(sverse_comp)
        main.addEventListener('click', local_versionsloader)
        sverse_comp.classList.remove('slideout')
        // sverse_comp.classList.add('slidein')
    }
}

// main.addEventListener('click', addLocalVersionsLoaderButtons)
main.addEventListener('contextmenu', addLocalVersionsLoaderButtons)

function addLocalVersionsLoaderButtons(e) {
    // The local versions loader should not be loaded if there is context menu in the window.
    // IF there is 'context_menu', then the first click should remove it.
    if (main.querySelector('#context_menu.slidein') == null) {
        // add_VersionsLoader_preventDoublick(e) // this works with click eventListener
        local_versionsloader(e) // this works with contextmenu eventListener
    }
}
//Get and append (or un-append) reference on click of comparison version button
main.addEventListener('click', localVersionLoader)

function localVersionLoader(e) {
    let clkelm = e.target;
    if (clkelm.matches('#singleverse_compare_menu [bversion]')) {
        let verseHolder = elmAhasElmOfClassBasAncestor(clkelm, 'vmultiple');
        let bversion = clkelm.getAttribute('bversion')
        if (!clkelm.matches('.active_button')) {
            let bkID = verseHolder.id.split('.')[0].split('_')[1];
            
            let refBreakDownObj = breakDownClickedVerseRef();
            bC = refBreakDownObj.bC;
            cV = refBreakDownObj.cV;
            bN = refBreakDownObj.bN;
            clkelm.classList.toggle('active_button');
            parseSingleVerse(null, bC, cV, null, verseHolder, bN, null, true, bversion);
        } else {
            verseHolder.querySelector('.v_' + bversion).remove();
            clkelm.classList.toggle('active_button');
        }
    }
}