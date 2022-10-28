main.addEventListener('mouseover', function (e) {
    let currentVversion = null,
        v_version;
    // console.log(e.target.matches('.verse'))
    if (e.target.matches('.verse')) {
        currentVversion = e.target;
    } else {
        currentVversion = elmAhasElmOfClassBasAncestor(e.target, '.verse')
    }
    if (currentVversion) {
        v_version = currentVversion.classList.forEach(cvinv => {
            if (cvinv.startsWith('v_')) {
                return currentVversion = cvinv
            }
        })
        let headPart = document.getElementsByTagName('head')[0];

        function appendVersionHighlightStyle() {
            let newStyleInHead = document.createElement('style');
            newStyleInHead.id = 'version_verses_highlightall';
            newStyleInHead.classList.add(currentVversion);
            newStyleInHead.innerHTML = `.${currentVversion}:not(:only-child){background-color: var(--verse-hover);background-color: var(--vmultiple-hover);box-shadow: 0 2px 2px 0 var(--shadow-color)`;
            headPart.append(newStyleInHead);
        }
        if (vvH = document.getElementById('version_verses_highlightall')) {
            if (!vvH.classList.contains(currentVversion)) {
                vvH.remove();
            }
        }
        if (!headPart.querySelector(`#version_verses_highlightall.${currentVversion}`)) {
            appendVersionHighlightStyle();
        }
    }
})
// main.addEventListener('mouseout', function (e) {
//     if (vvH = document.getElementById('version_verses_highlightall')) {
//         vvH.remove();
//     }
// })