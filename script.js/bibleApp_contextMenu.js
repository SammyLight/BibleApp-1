/* RIGHT-CLICK MENU */
let timer1, timer2;
let rightClickedElm = null;
// let context_menu = document.querySelector('#context_menu');
function add_tooltipContextMenu(e) {
    e.preventDefault();
    if (!document.querySelector('#context_menu')) {
        // <div id="context_menu" class="context_menu slideout"></div>
        let context_menu_replacement = document.createElement('div');
        context_menu_replacement.id = 'context_menu';
        context_menu_replacement.classList.add('context_menu');
        context_menu_replacement.classList.add('slideout');
        main.prepend(context_menu_replacement);
        context_menu.addEventListener("click", codeELmRefClick);
    }
    rightClickedElm = e.target;
    firstShadowColorOfElem = getBoxShadowColor(rightClickedElm)
        // FOR SHOWING AND HIDING THE RIGHTCLICK MENU
    var menusX = e.x;
    if (e.target.matches('.translated, .strnum, .crossrefs>span') /* && (!e.target.matches('#context_menu')&&!elmAhasElmOfClassBasAncestor(e.target,'#context_menu')) */ ) {
        getCurrentStrongsDef(e);
        clearTimeout(timer1);
        clearTimeout(timer2);

        // console.log(context_menu.getAttribute('strnum'))
        // console.log(e.target)

        if (e.type == 'mouseover') {
            clearTimeout(timer1);

            if ((!currentEt.matches('.strnum') && context_menu.getAttribute('strnum') != currentEt.getAttribute('strnum'))) {
                timer1 = setTimeout(function() {
                    timedFUNC();
                }, 300)
            } else if (!currentEt.matches('.strnum')) {
                timer1 = setTimeout(function() {
                    timedFUNC();
                }, 300)
            }
        } else {
            timedFUNC()
        }

        function timedFUNC() {
            let target_right = e.target.getBoundingClientRect().right;
            // let target_left = e.target.offsetLeft;
            let target_left = e.target.getBoundingClientRect().left;
            let target_top = e.target.offsetTop;
            // let target_top = e.target.getBoundingClientRect().top;
            let target_bottom = e.target.getBoundingClientRect().bottom;
            let target_width = e.target.offsetWidth;
            let originalWord, extraLeft = 0;
            let addquotes = true;
            let eParent;
            // console.clear()
            // console.log(elmAhasElmOfClassBasAncestor(e.target, '#searchPreviewFixed'))
            if (elmAhasElmOfClassBasAncestor(e.target, '#main')) {
                eParent = document.querySelector('#main');
                if (eParent.offsetLeft != 0) {
                    extraLeft = eParent.offsetLeft;
                }
                //if the #context_menu is not in #main, then it must be in #searchPreviewFixed
                if (!eParent.querySelector('#context_menu')) {
                    //move the #context_menu from #searchPreviewFixed to #main
                    let clonedContextMenu = searchPreviewFixed.querySelector('#context_menu').cloneNode(true);
                    searchPreviewFixed.querySelector('#context_menu').remove()
                    main.append(clonedContextMenu)
                }
            }
            //if the #context_menu is not in #searchPreviewFixed, then it must be in #main 
            else if (elmAhasElmOfClassBasAncestor(e.target, '#searchPreviewFixed')) {
                eParent = document.querySelector('#searchPreviewFixed');
                if (!eParent.querySelector('#context_menu')) {
                    //move the #context_menu from #main to #searchPreviewFixed
                    let clonedContextMenu = main.querySelector('#context_menu').cloneNode(true);
                    main.querySelector('#context_menu').remove()
                    searchPreviewFixed.append(clonedContextMenu)
                }
            }

            if (e.target.matches('.translated, .strnum')) {
                if (e.target.getAttribute("translation")) {
                    originalWord = e.target.getAttribute("translation");
                    if (truexlit = e.target.getAttribute("data-true-xlit")) {
                        if (elmAhasElmOfClassBasAncestor(e.target, 'rtl')) {
                            originalWord = `“${originalWord.trim()} : ”${truexlit}`;
                        } //because of the direction of the text
                        else {
                            originalWord = `“${originalWord.trim()}” : ${truexlit}`;
                        }
                        addquotes = false;
                    }
                } else {
                    originalWord = e.target.parentElement.getAttribute("translation")
                }
                let menu_inner;
                if (addquotes) {
                    menu_inner = `${e.target.getAttribute('data-title')}<hr>“${originalWord.trim()}”`;
                } else {
                    menu_inner = `${e.target.getAttribute('data-title')}<hr>${originalWord.trim()}`;
                }
                context_menu.innerHTML = menu_inner + newStrongsDef;
                // context_menu.removeAttribute('style');
                context_menu.style.height = null;
                context_menu.style.left = null;
                context_menu.setAttribute('strnum', e.target.getAttribute('strnum'))
                hideRefNav('show', context_menu)
            } else /* if (e.type == 'contextmenu' || e.type == 'mouseover')  */ {
                context_menu.innerText = null;
                if (e.target.matches('.crossrefs>span')) {
                    let cmtitlebar = document.createElement('div');
                    cmtitlebar.classList.add('cmtitlebar');
                    let cmtitletext = e.target.innerText;
                    let bknch = cmtitletext.split('.')[0] + '.' + cmtitletext.split('.')[1];
                    cmtitletext = bknch.split('.').join(' ') + ':' + cmtitletext.split(bknch + '.').join('') + ' [' + bversionName + ']';
                    // cmtitlebar.innerText=e.target.innerText;
                    cmtitlebar.innerText = cmtitletext;
                    context_menu.append(cmtitlebar);
                }
                context_menu.append(getCrossReference(e.target));
                // context_menu.removeAttribute('style');
                context_menu.style.height = null;
                context_menu.style.left = null;
                context_menu.setAttribute('strnum', e.target.getAttribute('strnum'))
                hideRefNav('show', context_menu)
            }
            /* POSITION MENU */
            let cmH = context_menu.offsetHeight;
            context_menu.style.left = menusX + window.scrollX - extraLeft + "px";
            let target_height = e.target.offsetHeight;
            if (window.innerWidth - target_left + extraLeft <= 300) {
                context_menu.style.right = window.innerWidth - target_right - window.scrollX + "px";
                context_menu.style.left = '';
            } else {
                context_menu.style.left = target_left + window.scrollX - extraLeft + "px";
                context_menu.style.right = "";
            }
            //IF CONTEXT MENU IS TO CLOSE TO THE BOTTOM
            let btnsBarHeight = document.querySelector('#top_horizontal_bar_buttons').getBoundingClientRect().height;
            let space_above_target = target_top - eParent.scrollTop;
            let space_below_target = window.innerHeight - btnsBarHeight - space_above_target;
            // Space Below Target Enough for ContextMenu
            if (space_below_target >= context_menu.offsetHeight) {
                // context_menu.style.height = space_below_target - eParent.offsetTop - target_height + "px";
                context_menu.style.top = target_top + target_height + "px";
            }
            // Space Below Target NOT Enough for ContextMenu
            else {
                // console.log('belowIsLEssThanCMH')
                if (space_below_target >= space_above_target) {
                    // console.log('111')
                    context_menu.style.height = space_below_target - eParent.offsetTop - target_height + "px";
                    context_menu.style.top = target_top + target_height + "px";
                } else {
                    // console.log('222')
                    if (space_above_target >= context_menu.offsetHeight) {
                        context_menu.style.top = target_top - context_menu.offsetHeight + "px";
                    } else {
                        context_menu.style.height = space_above_target + "px";
                        context_menu.style.top = target_top - context_menu.offsetHeight + "px";
                    }
                }
            }
        }
    } else if (context_menu.matches('.slidein') && (!e.target.matches('#context_menu') || !elmAhasElmOfClassBasAncestor(e.target, '.context_menu'))) {

        function removeContextMenu() {
            hideRefNav('hide', context_menu, removeCMPevtListner());
            context_menu.removeAttribute('strnum');
            context_menu.innerHTML = '';
        }
        // if (e.type == 'mouseover') {
        // timer2 = setTimeout(function () {
        removeContextMenu();
        // }, 10)
        // } else {
        // removeContextMenu()
        // }
    }
}
let newStrongsDef = '';

function getCurrentStrongsDef(e) {
    if (strnum = e.target.getAttribute('strnum')) {
        strnum = strnum.split(' ');
        getsStrongsDefinition(strnum);
        // console.log(strnum)
    }
    if (e.type == 'contextmenu') {
        context_menu.classList.add('rightclicked')
        context_menu.removeAttribute('strnum')
        context_menu.setAttribute('strnum', strnum)
        newStrongsDef = '<hr>' + currentStrongsDef;
        toolTipOnOff(false);
    } else if (e.type != 'contextmenu') {
        newStrongsDef = '';
    }
}

const add_tooltipContextMenu_preventDoublick = debounce(add_tooltipContextMenu, 300);

ppp.addEventListener('contextmenu', add_tooltipContextMenu, false);
searchPreviewFixed.addEventListener('contextmenu', add_tooltipContextMenu, false);
searchPreviewFixed.addEventListener('mousedown', add_tooltipContextMenu_preventDoublick, false);

ppp.addEventListener('mouseout', function(e) {
    if (e.target.matches('.translated, .strnum, .crossrefs>span')) {
        clearTimeout(timer1)
    }
});
main.addEventListener('mouseover', function(e) {
    if (e.target.matches('.translated')) {
        e.preventDefault()
    }
});

function add_mouseoverContextMenuEventListner() {
    // searchPreviewFixed.addEventListener('mouseover', add_tooltipContextMenu, false);
    searchPreviewFixed.addEventListener('click', add_tooltipContextMenu_preventDoublick, false);

    ppp.addEventListener('mouseover', add_tooltipContextMenu, false);
    // ppp.addEventListener('click', add_tooltipContextMenu, false);
    ppp.addEventListener('click', add_tooltipContextMenu_preventDoublick, false);
}

function remove_mouseoverContextMenuEventListner() {
    hideRefNav('hide', context_menu); //In case it is on the screen
    ppp.removeEventListener('mouseover', add_tooltipContextMenu, false);
    searchPreviewFixed.removeEventListener('click', add_tooltipContextMenu, false);
}
add_mouseoverContextMenuEventListner()

tool_tip.addEventListener('click', () => {
    toolTipOnOff();
    toolTipON = ttip_check.checked;
});

let toolTipON = ttip_check.checked; //Is modified by escape or alt + t
document.addEventListener('keydown', evt => {
    if (evt.key === 'y' && evt.altKey) {
        toolTipOnOff();
        toolTipON = ttip_check.checked;
    }
    if (evt.key === 'Escape') {
        hideRefNav('hide', context_menu);
        context_menu.innerHTML = '';
    }
});

function toolTipOnOff(x) {
    if (x == false || ttip_check.checked) {
        ttip_check.checked = false;
        tool_tip.classList.remove("active_button");
        remove_mouseoverContextMenuEventListner();
        // add_rClickcontextMenuEventListner();
        removeCMPevtListner();
    } else {
        ttip_check.checked = true;
        tool_tip.classList.add("active_button");
        add_mouseoverContextMenuEventListner();
        // remove_rClickcontextMenuEventListner();
    }
}
//Hide ContextMenu on clicking outside of main window
document.addEventListener('click', function(e) {
    if (document.querySelector('.context_menu') && (!e.target.matches('[strnum]') && !e.target.matches('.context_menu') && !elmAhasElmOfClassBasAncestor(e.target, '.context_menu'))) {
        hideRightClickContextMenu()
    }
})

function updateContextMenuPosition(oldScrollTop) {
    // console.log(main.scrollHeight)
    // console.log(oldScrollTop)
    // console.log(main.scrollTop)
    // console.log(main.clientHeight)
    // console.log(main.scrollHeight - main.scrollTop - main.clientHeight)
}

function addCMPevtListner() {
    let scrlT = main.scrollTop;
    ppp.addEventListener('scroll', updateContextMenuPosition(scrlT))
    searchPreviewFixed.addEventListener('scroll', updateContextMenuPosition(scrlT))
}

function removeCMPevtListner() {
    ppp.removeEventListener('scroll', updateContextMenuPosition)
    searchPreviewFixed.removeEventListener('scroll', updateContextMenuPosition)
}
// function add_rClickcontextMenuEventListner() {
//     ppp.addEventListener('contextmenu', add_tooltipContextMenu, false);
// }
// function remove_rClickcontextMenuEventListner() {
//     ppp.removeEventListener('contextmenu', add_tooltipContextMenu, false);
// }

context_menu.addEventListener("click", codeELmRefClick);

/* FOR SHOWING CROSSREFS AND VERSES NOTES */
ppp.addEventListener("mouseover", codeButtons);

function codeButtons(e) {
    if (document.getElementById('show_crossref_comments') == null) { //It may get removed on loading new reference
        let newElm = document.createElement('div');
        newElm.classList.add('slideout');
        newElm.id = 'show_crossref_comments';
        newElm.innerHTML = `<button class="buttons verse_crossref_button" id="verse_crossref_button"><a>TSK</a></button><button class="buttons verse_notes_button" id="verse_notes_button"><a>Note</a></button>`;
        ppp.append(newElm);
    } else if (show_crossref_comments) {
        if (e.target.matches('.verse code') && (e.type == 'mouseover')) {
            relocateElmTo(show_crossref_comments, e.target);
            show_crossref_comments.classList.remove('slideout');
            show_crossref_comments.classList.add('slidein');
        } else if (!e.target.matches('.verse code') && (e.type == 'mouseout')) {
            show_crossref_comments.classList.remove('slidein');
            show_crossref_comments.classList.add('slideout');
        }
    }
}