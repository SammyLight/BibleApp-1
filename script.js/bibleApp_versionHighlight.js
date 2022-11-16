hl_hoveredversion.addEventListener('click', () => {
    versionHighlight_ON_OFF();
    versionHighlight_ON = hl_hversion_check.checked;
});

let versionHighlight_ON = hl_hversion_check.checked; //Is modified by escape or alt + h
document.addEventListener('keydown', evt => {
    if (evt.key === 'h' && evt.altKey) {
        versionHighlight_ON_OFF();
        versionHighlight_ON = hl_hversion_check.checked;
    }
});

function versionHighlight_ON_OFF(x) {
    if (x == false || hl_hversion_check.checked) {
        hl_hversion_check.checked = false;
        setItemInLocalStorage('versionHighlightingOnHover', false)
        hl_hoveredversion.classList.remove("active_button");
        hoveredVersionHiglighting(false)
    } else {
        hl_hversion_check.checked = true;
        setItemInLocalStorage('versionHighlightingOnHover', true)
        hl_hoveredversion.classList.add("active_button");
        hoveredVersionHiglighting(true)
    }
}

function hoveredVersionHiglighting(oo_off) {
    if (oo_off == true) {
        main.addEventListener('mouseover', versionHiglightingOnHover, false)
    } else if (oo_off == false) {
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