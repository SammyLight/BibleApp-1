// FOR STRONGS LEXICON
var requestStrongsURL = 'bibles_JSON/strongs.json';
var strongsJSON = new XMLHttpRequest();
strongsJSON.open('GET', requestStrongsURL);
strongsJSON.responseType = 'json';
strongsJSON.send();

let strongsJSONresponse, strngsAll;
strongsJSON.onload = function () {
    strongsJSONresponse = strongsJSON.response;
}

// Create and Append Transliteration Data Attribute
function createTransliterationAttr(x, l) {
    // console.log(l)
    let translatedWordsInVerse = x.querySelectorAll('[strnum]');
    translatedWordsInVerse.forEach(strNumElm => {
        wStrnum_array = strNumElm.getAttribute('strnum').split(' ');
        let i = 0;
        wStrnum_array.forEach(wStrnum => {
            i++;
            let divider = '|';
            if ((i > 1) && ((i > 2) && (i != wStrnum_array.length))) {
                divider = '|'
            } else if ((i == 1) || ((i > 2) && (i == wStrnum_array.length))) {
                divider = ''
            }
            //For Greek/Hebrew Bibles
            if (l == 'original') {
                strNumElm.setAttribute("data-true-xlit", keyValueReplacer(strNumElm.innerText));
            }
            // CHECK STRONGS DICTIONARY
            for (abc = 0; abc < strongsJSONresponse.length; abc++) {
                if (strongsJSONresponse[abc].number == wStrnum) {
                    strNumElm.classList.add(wStrnum)
                    let str_xlit = strongsJSONresponse[abc].xlit;
                    let str_lemma = strongsJSONresponse[abc].lemma;
                    strNumElm.setAttribute("data-xlit", strNumElm.getAttribute("data-xlit") + divider + str_xlit);
                    strNumElm.setAttribute("data-lemma", strNumElm.getAttribute("data-lemma") + divider + str_lemma);
                    let strNum_Title = '';
                    strNumElm.setAttribute('data-title', wStrnum + " | " + str_xlit + " | " + str_lemma);
                    // strNumElm.setAttribute('title', wStrnum + " | " + str_xlit + " | " + str_lemma);
                    break
                }
            }
        });
        let strNum_Title = '';
        if (strNumElm.getAttribute('data-title')) {
            strNum_Title = strNumElm.getAttribute('data-title');
        }
        // strNumElm.setAttribute('data-title', '(' + strNumElm.getAttribute("translation") + ')' + strNum_Title);
        strNumElm.setAttribute('data-title', strNum_Title);
    });
}
let currentStrongsDef = null;

function getsStrongsDefinition(x) {
    strongsdefinitionwindow.innerHTML = '';
    let _text = '';
    x.forEach(wStrnum => {
        for (abc = 0; abc < strongsJSONresponse.length; abc++) {
            if (strongsJSONresponse[abc].number == wStrnum) {
                let str_xlit = strongsJSONresponse[abc].xlit;
                let str_lemma = strongsJSONresponse[abc].lemma;
                let str_definition = strongsJSONresponse[abc].description;
                _text = _text + `<div class="strngsdefinition"><hr><h2>${wStrnum}</h2>
                <div><i>Lemma</i>: <h2>${str_lemma}</h2></div>
                <div><i>Transliteration</i>: <h2>${str_xlit}</h2></div>
                <div><h2><hr>Definition:</h2></div><hr> ${str_definition}<hr>
                </div>
                `
                strongsdefinitionwindow.innerHTML = _text;
                currentStrongsDef = _text;
                break
            }
        }
    });
}

//TO SHOW TRANSLITERATION OF WORDS
var transliteratedWords_Array = [];

function showTransliteration(stn) {
    let allSimilarWords = pagemaster.querySelectorAll('.' + stn);
    allSimilarWords.forEach(elm => {
        elm.innerHTML = '';
        let xlitFragment = new DocumentFragment();
        let elm_strnum = elm.getAttribute("strnum").split(' ');
        let elm_dxlit = elm.getAttribute("data-xlit").split('|');
        let elm_lemma = '';
        if (elm.getAttribute("data-lemma")) {
            elm_lemma = elm.getAttribute("data-lemma").split('|')
        }
        let engTranslation;
        let trueTransliteration = null;
        if (elm.getAttribute("data-true-xlit")) { //If it is from Greek Bible
            trueTransliteration = elm.getAttribute("data-true-xlit");
        } else { //If it is not from Greek Bible
            engTranslation = elm.getAttribute("translation");
        }
        let j = 0;
        elm_strnum.forEach(eStn => {
            let transSpan = document.createElement('SPAN');
            transSpan.classList.add(eStn);
            transSpan.classList.add('strnum')
            transSpan.setAttribute('strnum', eStn);
            transSpan.setAttribute('data-xlit', elm_dxlit[j]);
            let sLemma = ' | ' + elm_lemma[j];
            transSpan.setAttribute('data-title', eStn + ' | ' + elm_dxlit[j] + sLemma);
            if (elm.getAttribute("transliteration")) {
                transSpan.innerText = ' ' + elm.getAttribute("transliteration").split(' ')[j];
            } else {
                transSpan.innerText = ' ' + elm_dxlit[j];
            }
            if (trueTransliteration) {
                transSpan.setAttribute("data-true-xlit", trueTransliteration);
                transSpan.innerText = ' ' + trueTransliteration;
            }
            xlitFragment.append(transSpan);
            j++
        });
        elm.append(xlitFragment);
        elm.classList.add('eng2grk');
    })
}

function hideTransliteration(stn) {
    let allSimilarWords = pagemaster.querySelectorAll('.' + stn);
    allSimilarWords.forEach(elm => {
        elm.classList.remove('eng2grk');
        elm.innerHTML = '';
        elm.innerHTML = elm.getAttribute("translation");
    })
}

function highlightAllStrongs(x) {
    cs = `span[strnum="` + x + `"]{background-color:${randomColor(200)};border-radius:2px;color:black!important;`
    //CREATE THE INNER-STYLE WITH ID #highlightstrongs IN THE HEAD IF IT DOESN'T EXIST
    if (!document.querySelector('style#highlightstrongs')) {
        createNewStyleSheetandRule('highlightstrongs', cs)
    }
    //ELSE IF IT ALREADY EXISTS
    else {
        let ruleSelector = `span[strnum="${x}"]`
        addRemoveRuleFromStyleSheet(cs, ruleSelector, highlightstrongs)
    }
}
var clickeElmArray = [];
let timerstn;

function removeRecentStrongsFromArray(stn) {
    timerstn = setTimeout(() => {
        const index = clickeElmArray.indexOf(stn);
        if (index > -1) {
            clickeElmArray.splice(index, 1)
        }
        highlightAllStrongs(stn)
        if (highlightstrongs) {
            setItemInLocalStorage('strongsHighlightStyleSheet', getAllRulesInStyleSheet(highlightstrongs));
        }
    }, 300);
}

function strongsHighlighting(e) {
    let clickedElm;
    //IF IT IS A WORD TRANSLATED FROM HEBREW/GREEK
    if (e.target.classList.contains('translated')) {
        clickedElm = e.target;
        let stn = clickedElm.getAttribute('strnum');
        if (!clickeElmArray.includes(stn)) {
            clickeElmArray.push(stn)
            removeRecentStrongsFromArray(stn);
        }
    }
    //IF IT IS THE STRONGS WORD ITSELF
    else if (e.target.parentElement.classList.contains('translated')) {
        clickedElm = e.target.parentElement;
        let stn = clickedElm.getAttribute('strnum');
        if (!clickeElmArray.includes(stn)) {
            clickeElmArray.push(stn)
            removeRecentStrongsFromArray(stn);
        } else { //If doubleclicked (stn will still be in the array)
            clickeElmArray.shift(stn);
            clearTimeout(timerstn)
        }
    }
}
//ON PAGE LOAD, GET TRANSLITERATED ARRAY FROM CACHE
//window.onload = () => cacheFunctions();
//Moved to after loading of first chapter

pagemaster.addEventListener("dblclick", function (e) {
    hoverElm = e.target;
    if (hoverElm.nodeName == 'SPAN' && hoverElm.classList.contains('translated') && !hoverElm.classList.contains('eng2grk')) {
        let allstn = hoverElm.getAttribute('strnum').split(' '); //Some words are translated from more than one word
        allstn.forEach(stn => {
            if (transliteratedWords_Array.indexOf(stn) == -1) {
                /* ADD THE WORD TO THE transliteratedWords_Array */
                transliteratedWords_Array.push(stn);
            }
            showTransliteration(stn)
        })
    } else if (hoverElm.classList.contains('strnum')) {
        let allstn = hoverElm.parentElement.getAttribute('strnum').split(' ');
        allstn.forEach(stn => {
            if (transliteratedWords_Array.indexOf(stn) != -1) {
                /* REMOVE THE WORD FROM THE transliteratedWords_Array */
                transliteratedWords_Array.splice(transliteratedWords_Array.indexOf(stn), 1);
            }
            hideTransliteration(stn)
        })
    }
    setItemInLocalStorage('transliteratedWords', transliteratedWords_Array);
})

//HIGHLIGHTING CLICKED WORD
const strongs_dblclick_prevent = debounce(strongsHighlighting, 300);
main.addEventListener("click", strongs_dblclick_prevent)
searchPreviewFixed.addEventListener("click", strongs_dblclick_prevent)
main.addEventListener("click", hideBibleNav)

function hideBibleNav() {
    hideRefNav('hide', bible_nav)
} //HIDE refnav SIDE BAR IF OPEN BY CLICKING ANYWHERE ON THE PAGE

/* EVENT LISTENERS FOR THE HIGHLIGHING ALL ELEMENTS WITH THE SAME CLASS NAME BY HOVERING OVER ONE OF THEM */
/* This is acomplished by modifying the styles in the head */
main.addEventListener('mouseover', function (e) {
    let strAtt;
    if (e.target.getAttribute('strnum')) {
        strAtt = e.target.getAttribute('strnum')
    } else if (elmAhasElmOfClassBasAncestor(e.target, '[strnum]')) {//For context_menu when it is serving a strong's number
        strAtt=elmAhasElmOfClassBasAncestor(e.target, '[strnum]').getAttribute('strnum');
    }
    if (strAtt) {
        if (document.getElementById('')) {
            document.getElementById('highlightall').remove();
        }
        let newStyleInHead = document.createElement('style');
        strAtt = strAtt.split(' ');
        transStyleSelector = '';
        let i = 0;
        let comma = '';
        strAtt.forEach(stn => {
            i++;
            if (i > 1) {
                comma = ','
            }
            transStyleSelector = transStyleSelector + comma + '.' + stn;
        });
        newStyleInHead.id = 'highlightall';
        // newStyleInHead.innerHTML = `${transStyleSelector}{background-color:var(--chpt);border-radius:2px;border-bottom: 1px solid rgb(151, 116, 0);color:black!important;`;
        newStyleInHead.innerHTML = `${transStyleSelector}{
            z-index:2;background-color:var(--strongword-hover)!important;
            border-radius:2px;border-bottom: 4px dashed var(--redwords)!important;
            color:black!important;
            transition: background-color .1s ease-in;
            `;
            /* box-shadow:0 0.5px 1px 0px var(--shadow-color)!important; */
        let headPart = document.getElementsByTagName('head')[0];
        headPart.append(newStyleInHead);
    }
})
main.addEventListener('mouseout', function (e) {
    if (e.target.hasAttribute('strnum')) {
        document.getElementById('highlightall').remove();
    }
})