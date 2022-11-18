
function versionHighlighting_ON_OFF(x) {
    //Turn off versions_highlighting
    if (x == false||x == 'false') {
        // console.log(localStorage.getItem(x))
        hoveredVersionHiglighting(false)
    }
    else if (hl_hversion_check.checked==true) {
        hoveredVersionHiglighting(false)
    }
    //Turn on versions_highlighting
    else {
        hoveredVersionHiglighting(true)
    }
}

hl_hoveredversion.addEventListener('click', () => {
    versionHighlighting_ON_OFF();
});
//Is modified by escape or alt + h
document.addEventListener('keydown', evt => {
    if ((evt.key === 'h'||evt.key === 'H') && evt.altKey) {
        versionHighlighting_ON_OFF();
    }
    if ((evt.key === 'd'||evt.key === 'D') && evt.altKey) {
        evt.preventDefault()
        darkLightMode();
    }
});

function hoveredVersionHiglighting(oo_off) {
    if (oo_off == true) {
        setItemInLocalStorage('versionHighlightingOnHover', true)
        hl_hversion_check.checked = true;
        hl_hoveredversion.classList.add("active_button");
        main.addEventListener('mouseover', versionHiglightingOnHover, false)
    } else if (oo_off == false) {
        setItemInLocalStorage('versionHighlightingOnHover', false)
        hl_hversion_check.checked = false;
        hl_hoveredversion.classList.remove("active_button");
        main.removeEventListener('mouseover', versionHiglightingOnHover, false)
        // remove the style sheet for it if present
        if (vvH = document.getElementById('version_verses_highlightall')) {
            vvH.remove();
        }
    }
}
function versionHiglightingOnHover(e) {
    // e.preventDefault();
    let currentVversion = null;
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
            newStyleInHead.innerHTML = `.${currentVversion}:not(:only-child){
        background-color: var(--vmultiple-hover);
        box-shadow: 0 2px 2px 0 var(--shadow-color)`;
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
}
// main.addEventListener('mouseout', function (e) {
//     if (vvH = document.getElementById('version_verses_highlightall')) {
//         vvH.remove();
//     }
// })

/* ********************************** */
