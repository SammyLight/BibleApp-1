/* GENERAL HELPER FUNCTIONS */
function isObject(objValue) {
    return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

/* Ensure doublick does not run click eventListner */
function debounce(func, timeout = 300) {
    // function func will only run if it is not clicked twice within 300ms
    var ttt;
    return function() {
        if (ttt) {
            console.log('clearing Timeout')
            clearTimeout(ttt)
            ttt = undefined;
        } else {
            // console.log('setting Timeout')
            const context = this
            const args = arguments
            ttt = setTimeout(() => {
                func.apply(context, args);
                ttt = undefined;
                // console.log('done & cleared')
            }, timeout)
        }
    }
}

function removeItemFromArray(n, array) {
    const index = array.indexOf(n);

    // if the element is in the array, remove it
    if (index > -1) {

        // remove item
        array.splice(index, 1);
    }
    return array;
}

/* Remove single string or array of strings from a string */
function removeCharacterFromString(xh, str) {
    if (typeof xh === 'string' || xh instanceof String) { return str.split(xh).join('') }
    //An array of characters to remove from the string,
    // e.g., "['.',',','lk']"
    else if (Array.isArray(xh)) {
        xh.forEach(xh_i => { str.split(xh_i).join('') });
        return str
    }
}

/* ***************************** */
/*       DOM MANIPULATIONS       */
/* ***************************** */

function elmAhasElmOfClassBasAncestor(a, ancestorsClass, limit = 'BODY') {
    while (a.parentElement && a.parentElement.tagName.toUpperCase() != limit) {
        if (a.parentElement.classList.contains(ancestorsClass) || a.parentElement.matches(ancestorsClass)) {
            return a.parentNode
        }
        a = a.parentElement;
    }
    return false

    //The :has() pseudo selector will do this quite easily, but,
    // First: elmA will have to be represented as a css selector, e.g., 'div>.a', and
    // Second: It is not yet supported in Mozilla FireFox
    // E.g: if(querySelector('.ancestorsClass:has(div>.a)'){return true})
}

function hideORshowID(hideOrShow, id) {
    if (hideOrShow.toUpperCase() == 'HIDE') {
        var id2hide = document.querySelectorAll('#' + id);
        id2hide.forEach(el => {
            el.style.display = 'none'
        });
    } else if (hideOrShow.toUpperCase() == 'SHOW') {
        var id2show = document.querySelectorAll('#' + id);
        id2show.forEach(el => {
            el.style.display = ''
        });
    } else {
        id = hideOrShow
        var id2toggle = document.querySelector('#' + id);
        // console.log(id2toggle.style.display)
        if (id2toggle.style.display == "none") {
            id2toggle.style.display = "block";
        } else {
            id2toggle.style.display = "none";
        }
    }
}

function hideORshowClass(hideOrShow, cls) {
    if (hideOrShow.toUpperCase() == 'HIDE') {
        var class2hide = document.querySelectorAll('.' + cls);
        class2hide.forEach(el => {
            el.style.display = 'none'
        });
    } else if (hideOrShow.toUpperCase() == 'SHOW') {
        var class2show = document.querySelectorAll('.' + cls);
        class2show.forEach(el => {
            el.style.display = ''
        });
    }
}

function hideElement(el) {
    el.classList.add("displaynone")
}

function showElement(el) {
    el.classList.remove("displaynone")
}

function toggleClassAndActiveButton(elm, cls, originElm) {
    elm.classList.toggle(cls)
    originElm.classList.toggle('active_button');
}

function disableButton(cls, disableValue) {
    var class2toggleAttribute = document.querySelectorAll('.' + cls);
    class2toggleAttribute.forEach(el => {
        el.disabled = disableValue;
        if (disableValue) {
            el.style.pointerEvents = 'none';
            el.style.color = 'grey';
            el.style.fontStyle = 'italic';
        } else if (!disableValue) {
            el.style.pointerEvents = '';
            el.style.color = '';
            el.style.fontStyle = '';
        }
    });
    // Or just create a css style for class, e.g., 'button_disabled',
    // and then add the class to buttons to be disabled
}

// Check or uncheck radio/checkbox input
function checkUncheck(x) {
    let arrOfCheckBoxes;
    if (Array.isArray(x) == false) { arrOfCheckBoxes = [x] } else { arrOfCheckBoxes = x }

    arrOfCheckBoxes.forEach(rcbx => {
        if (rcbx.type == 'input') { rcbx.click(); } else {
            if (rcbx.checked == true) { rcbx.checked = false } else { rcbx.checked = true }
        }
    });
}

function insertElmAbeforeElmB(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode);
}

function relocateElmTo(elm, moveHere) {
    let elmCopy = elm.cloneNode(true);
    elm.remove();
    moveHere.append(elmCopy)
}

// GET FIRST SHADOW COLOR
function getBoxShadowColor(elm) {
    // Even if element has more than one box-shadow color, it will only get the first one
    let boxShadowOfElem = window.getComputedStyle(elm, null).getPropertyValue("box-shadow");
    return boxShadowOfElem.split('px')[0].replace(/^.*(rgba?\([^)]+\)).*/, '$1')
}

/* ****************************** */
/*        DOM EXPLORATIONS        */
/* ****************************** */

function X_hasNoSibling_Y_b4_Z(x, y, z) {
    let a = x,
        yes_no = false,
        Y = null,
        Z = null,
        elm2appendAfter = x;
    while (a.nextElementSibling) {
        if (a.nextElementSibling.matches(z)) {
            Z = a.nextElementSibling;
            elm2appendAfter = x;
            yes_no = true;
            break
        } else if (a.nextElementSibling.matches(y)) {
            Y = a.nextElementSibling;
            elm2appendAfter = Y;
            aa = Y.nextElementSibling;
            yes_no = false;
            while (aa) {
                if (aa.matches(z)) {
                    Z = aa;
                    break
                }
                aa = aa.nextElementSibling;
            }
            break
        } else {
            a = a.nextElementSibling;
        }
    }
    return {
        elm2appendAfter: elm2appendAfter,
        yes_no: yes_no,
        elmY: Y,
        elmZ: Z
    }
}

function getSibling_Y_of_X_b4_Z(x, y, z) {}

function arrayOfNodesBetween(a, b) {
    //first check if they have the same parent
    let a_b_parent = a.parentNode;
    if (a_b_parent != b.parentNode) {
        return {
            array: [],
            indexOfA: -1,
            indexOfA: -1,
            length: 0
        }
    }
    let childNodesArr = a_b_parent.childNodes;
    let aIndx = null;
    let bIndx = null;
    //find their respective positions in their parent
    for (i = 0; i < childNodesArr.length; i++) {
        let cnode = childNodesArr[i];
        if (cnode == a) {
            aIndx = i
        }
        if (cnode == b) {
            bIndx = i
        }
        //no need to loop through every node once we have the indexes of a and b
        if (aIndx != null && bIndx != null) {
            return allnodesbtwAnB(childNodesArr, aIndx, bIndx)
        }
    };

    function allnodesbtwAnB(childNodesArr, aIndx, bIndx) {
        let arrOfNodesInbetween = [];
        if (aIndx == bIndx) {
            return arrOfNodesInbetween
        }
        let n1 = null,
            n2 = null;
        if (aIndx < bIndx) {
            n1 = aIndx;
            n2 = bIndx
        } else {
            n1 = bIndx;
            n2 = aIndx
        }
        for (j = n1 + 1; j < n2; j++) {
            arrOfNodesInbetween.push(childNodesArr[j])
        }
        return {
            arr: arrOfNodesInbetween,
            indexOfA: aIndx,
            indexOfA: bIndx,
            length: arrOfNodesInbetween.length
        }
    }
}

function arrayOfElementsBetween(a, b) {
    //first check if they have the same parent
    let a_b_parent = a.parentElement;
    if (a_b_parent != b.parentElement) {
        return {
            array: [],
            indexOfA: -1,
            indexOfA: -1,
            length: 0
        }
    }
    let childrenArr = a_b_parent.children;
    let aIndx = null;
    let bIndx = null;
    //find their respective positions in their parent
    for (i = 0; i < childrenArr.length; i++) {
        let cElm = childrenArr[i];
        if (cElm == a) {
            aIndx = i
        }
        if (cElm == b) {
            bIndx = i
        }
        //no need to loop through every element once we have the indexes of a and b
        if (aIndx != null && bIndx != null) {
            return allElementsbtwAnB(childrenArr, aIndx, bIndx)
        }
    };

    function allElementsbtwAnB(childrenArr, aIndx, bIndx) {
        let arrOfNodesInbetween = [];
        if (aIndx == bIndx) {
            return arrOfNodesInbetween
        }
        let n1 = null,
            n2 = null;
        if (aIndx < bIndx) {
            n1 = aIndx;
            n2 = bIndx
        } else {
            n1 = bIndx;
            n2 = aIndx
        }
        for (j = n1 + 1; j < n2; j++) {
            arrOfNodesInbetween.push(childrenArr[j])
        }
        return {
            array: arrOfNodesInbetween,
            indexOfA: aIndx,
            indexOfA: bIndx,
            length: arrOfNodesInbetween.length
        }
    }
}

/* ********************************************* */
/* LIGHTCITY BIBLE APP SPECIFIC HELPER FUNCTIONS */
/* ********************************************* */
function codeELmRefClick(e) {
    if (e.target.tagName == "CODE") {
        let codeElm = e.target;
        gotoRef(codeElm.getAttribute('ref'))
        e.preventDefault();
    }
}
// function getFUllBookName(shortBkNm) {
//     bible.Data.books.forEach((ref_, ref_indx) => {
//         if (ref_.includes(shortBkNm.toUpperCase())) {
//             let fullname = bible.Data.bookNamesByLanguage.en[ref_indx]
//             return fullname;
//         }
//     });
// }

/* DIV RESIZER - DRAGGING TO RESIZE */
const BORDER_SIZE = 10;
const panel = document.getElementById("strongsdefinitionwindow");
const resizerdiv = document.getElementById("resizerdiv");

let m_pos;
let old_width;
let hasBeenClicked = false;

// resizerdiv.addEventListener("mousedown", resizeStrongsDefinitionWindow, false);

function resizeDiv(e) {
    const dx = e.x - m_pos;
    //   const dx = m_pos - e.x;
    if (dx > 0) {
        let increased_width = old_width + dx;
        panel.style.maxWidth = increased_width + "px";
        panel.style.minWidth = increased_width + "px";
    } else if (dx < 0) {
        let decreased_width = old_width + dx;
        panel.style.maxWidth = decreased_width + "px";
        panel.style.minWidth = decreased_width + "px";
    }
    if (parseInt(getComputedStyle(panel, '').width) < 200) {
        panel.style.maxWidth = "200px";
        panel.style.minWidth = "200px";
    }
}

function handleSelectAttempt(event) {
    if (window.event) {
        event.returnValue = false;
    }
}

function resizeStrongsDefinitionWindow(e) {
    if (e.target.matches('#resizerdiv') && hasBeenClicked == false && e.offsetX < BORDER_SIZE) {
        m_pos = e.x;
        old_width = parseInt(getComputedStyle(panel, '').width);
        hasBeenClicked = true;
        document.addEventListener("mousemove", resizeDiv, false);
        document.addEventListener('selectstart', handleSelectAttempt, false)
        document.addEventListener("mouseup", remove_resizer_funcs, false);
    }
}

function remove_resizer_funcs() {
    console.log('JESJSUS')
    document.removeEventListener("mousemove", resizeDiv, false);
    document.removeEventListener('selectstart', handleSelectAttempt);
    hasBeenClicked = false;
}

/* SORT OBJECTS */
// function sortObj(obj) {
//     return Object.keys(obj).sort().reduce(function (result, key) {
//         result[key] = obj[key];
//         return result;
//     }, {});
// }

//Random Color Generator
function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

function isAsubArrayofB(a, b) {
    let aL = a.length;
    let bL = b.length;
    //b cannot contain a if a is longer
    if (bL >= aL) {
        // start comparison where at the last possible starting point of a in b.
        // E.g., if aL is 3 and bL is 5, then the last possible starting point of a in b is 2
        let lastPossibleStartIndex = bL - aL;
        let lind = lastPossibleStartIndex;
        while (lind >= 0) {
            let i = 0,
                j = lind;
            while (a[i] == b[j]) {
                if (i == aL - 1) {
                    return true
                }
                i++;
                j++;
            }
            lind--; //move backwards in b array from last possible index to the start of b
        }
        return false
    }
    return false
}

function areAllitemsOfAinB(a, b) {
    if (a.every(elem => b.indexOf(elem) > -1)) {
        return true
    } else {
        return false
    }
}


/* WATCH FOR INACTIVITY IN ELM AND RUN FUNCTION AFTER SET-TIME */
// https://www.brcline.com/blog/detecting-inactivity-in-javascript
function runFuncAfterSetTimeInactivityInElm(elm2Watch, timeoutInMiliseconds = 60000, func2run) {
    var timeoutId;

    function resetTimer() {
        window.clearTimeout(timeoutId)
        startTimer();
    }

    function startTimer() {
        // window.setTimeout returns an Id that can be used to start and stop a timer
        timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds)
    }

    function doInactive() {
        // Clear the eventListeners
        elm2Watch.removeEventListener("mousemove", resetTimer, false);
        elm2Watch.removeEventListener("mousedown", resetTimer, false);
        elm2Watch.removeEventListener("keypress", resetTimer, false);
        elm2Watch.removeEventListener("touchmove", resetTimer, false);
        // if(searchsettings.classList.contains('active_button')){searchsettings.click()}
        // totalfound.innerHTML='Search Cleared';
        func2run()
    }

    // function setupTimers () {
    elm2Watch.addEventListener("mousemove", resetTimer, false);
    elm2Watch.addEventListener("mousedown", resetTimer, false);
    elm2Watch.addEventListener("keypress", resetTimer, false);
    elm2Watch.addEventListener("touchmove", resetTimer, false);

    startTimer();
    // }
}

/* CHECK IF DEVICE IS A MOBILE DEVICE */
// window.addEventListener("load", () => {
//     // (A) CHECK FOR MOBILE
//     isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);

//     // (B) DO SOMETHING...
//     if (isMobile) { console.log("Is mobile device"); }
//     else { console.log("Not mobile device"); }
//   });