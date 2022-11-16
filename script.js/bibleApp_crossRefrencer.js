ppp.addEventListener("click", appendCrossReferences);
bversionName = 'KJV';
main.addEventListener('mousedown', getCurrentBVN)

function getCurrentBVN(e) {
    let eTarget = e.target;
    let classesOfe = null;
    if (eTarget.matches('.verse')) {
        classesOfe = eTarget.classList;
    } else if (eTarget = elmAhasElmOfClassBasAncestor(eTarget, '.verse')) {
        classesOfe = eTarget.classList;
    }
    if (classesOfe) {
        getBVN(classesOfe)
    }

    function getBVN(classesOfe) {
        for (q = 0; q < classesOfe.length; q++) {
            let cl = classesOfe[q]
            if (cl.startsWith('v_')) {
                bversionName = cl.split('v_')[1];
                return
            }
        };
    }
}

function appendCrossReferences(e) {
    if (!e.target.matches('#verse_crossref_button') && !e.target.parentNode.matches('#verse_crossref_button')) {
        return
    }
    let eTarget;
    if (e.target.matches('#verse_crossref_button')) { eTarget = e.target.parentNode.parentNode } else if (e.target.matches('#verse_crossref_button a')) { eTarget = e.target.parentNode.parentNode.parentNode }
    let masterVerseHolder = elmAhasElmOfClassBasAncestor(e.target, '.vmultiple');
    let siblingCrossREF = masterVerseHolder.nextElementSibling;
    if (siblingCrossREF == null || !siblingCrossREF.matches('.crossrefs') || siblingCrossREF == undefined) {
        let refCode = null;
        let vHolder = null;

        masterVerseHolder.classList.add('showing_crossref')

        let versionVerse, vmultiple_NextSibling = elmAhasElmOfClassBasAncestor(eTarget, 'vmultiple').nextElementSibling;
        if (eTarget.matches('.vmultiple [ref]') && (vmultiple_NextSibling == null || !vmultiple_NextSibling.matches('.crossrefs'))) {
            refCode = eTarget.getAttribute('ref');
            vHolder = elmAhasElmOfClassBasAncestor(eTarget, 'vmultiple');
            versionVerse = vHolder.querySelector('.v_KJV');
        }
        if (refCode) {
            refCode = refCode.replace(/(\w)\s([0-9]+)/g, '$1.$2'); //Romans 2:3==>Romans.2:3
            refCode = refCode.replace(/:/g, '.'); //Romans.2:3==>Romans.2.3
            let crossRef = crossReferences_fullName[refCode];

            let narr = []
            crossRef.forEach(cf => {
                let cfr = cf.split('.')
                let cv = cfr[0] + '.' + cfr[1] + '.'
                cf = cfr[0] + '.' + cfr[1] + '.' + cf.split(cv).join('')
                cf = cf.replace(/(\w)\.([0-9]+)/g, '$1 $2');
                cf = cf.replace(/\./g, ':');
                narr.push(cf)
            })
            crossRef = narr;
            parseCrossRef(crossRef, refCode);

            function parseCrossRef(crossRef, refCode) {
                let crfFrag = new DocumentFragment();
                crossRef.forEach(crf => {
                    let crfSpan = document.createElement('SPAN');
                    crfSpan.innerText = crf;
                    crfFrag.append(crfSpan);
                    crfFrag.append('; ');
                });
                let crfDiv = document.createElement('DIV');
                crfDiv.append(crfFrag);
                crfDiv.classList.add('crossrefs');
                vHolder.parentNode.insertBefore(crfDiv, vHolder.nextSibling);
                return crfDiv
            }
        }
    } else {
        siblingCrossREF.classList.add('slideup')
        setTimeout(() => {
            masterVerseHolder.classList.remove('showing_crossref')
            siblingCrossREF.remove()
        }, 500);
    }
}

function getCrossReference(x) {
    let crf2get;
    if (x.hasAttribute('ref')) {
        crf2get = x.getAttribute('ref');
    } else {
        crf2get = x.innerText;
    }
    crf2get = crf2get.split(' ').join('.').split(':').join('.');
    let bk = crf2get.split('.')[0]
    let chp1 = Number(crf2get.split('.')[1]);
    let vrs1 = Number(crf2get.split('.')[2]);
    let chp2 = chp1;
    let vrs2 = vrs1;
    let fullBkn;
    bible.Data.books.forEach((ref_, ref_indx) => {
        if (ref_.includes(bk.toUpperCase())) {
            fullBkn = bible.Data.bookNamesByLanguage.en[ref_indx];
            return
        }
    });
    let vHolder = new DocumentFragment();
    let br = '';
    if (crf2get.includes(',')) {
        let vrsGrpsByCommas = crf2get.split(',');
        console.log(vrsGrpsByCommas)
        let grp1 = vrsGrpsByCommas.shift(); // Will contain a full reference, c.g., Gen 2:16-17
        let vRange1 = verseRange(grp1);
        getVersesInVerseRange(vRange1);
        let vRanges = [];
        vrsGrpsByCommas.forEach(vg => getVranges(vg))
        vRanges.forEach(vR => {
            br = '<hr>'
            getVersesInVerseRange(vR)
        })

        function getVranges(vg) {
            if (vg.split('-').length > 1) { // it is a range, e.g., 5-13
                vRanges.push([Number(vg.split('-')[0]), Number(vg.split('-')[1])])
            } else { // it is a single number
                vRanges.push([Number(vg), Number(vg)])
            }
        }
    } else {
        vRange = verseRange(crf2get);
        getVersesInVerseRange(vRange);
    }

    function verseRange(crf2get) {
        if (crf2get.includes('-')) { //MORE THAN ONE VERSE
            vrs1 = Number(crf2get.split('-')[0].split('.')[2]);
            let ref_secondHalf = crf2get.split('-')[1].split('.')

            //e.g., Gen.1.3-Gen.1.6
            if (ref_secondHalf.length > 1) {
                chp2 = Number(ref_secondHalf[1]);
                vrs2 = Number(ref_secondHalf[2]);
            }
            //e.g., Gen.1.3-6
            else {
                chp2 = chp1;
                vrs2 = Number(ref_secondHalf[0]);
            }
        }
        return [vrs1, vrs2]
    }

    function getVersesInVerseRange(vRange) {
        let vrs1 = vRange[0]
        let vrs2 = vRange[1]
        for (i = vrs1; i < vrs2 + 1; i++) {
            let verseSpan = document.createElement('span');

            function vNum() {
                let verseNum = document.createElement('code');
                verseNum.setAttribute('ref', bk + ' ' + (chp1) + ':' + i);
                verseNum.setAttribute('aria-hidden', 'true'); //so that screen readers ignore the verse numbers
                verseNum.prepend(document.createTextNode(`[${(bk)} ${(chp1)}:${i}]`));
                verseNum.title = bversionName + ' ' + bookName;
                verseSpan.prepend(verseNum);
                // if(br){
                verseSpan.innerHTML = br + verseSpan.innerHTML;
                // }
                // else{verseSpan.innerHTML='<div></div>'+verseSpan.innerHTML;}
                let vText = window[bversionName][fullBkn][chp1 - 1][i - 1]
                    // console.log(parseVerseText(vText, verseSpan));
                vHolder.append(parseVerseText(vText, verseSpan));
                br = '<br>';
            }
            vNum();
        }
    }
    createTransliterationAttr(vHolder)
    return vHolder;
}
// main.addEventListener("click", searchPreviewRefClick)