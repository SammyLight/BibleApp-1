let lastRef;
let updateRefBrowserHistory = (ref) => {
    // if(e.state.ref&&e.state.ref==ref){return}
    lastRef = ref;
    
    // if (ref && (window.location.hash==''||ref!=window.location.hash.split('%20').join(' '))) {
    if (ref) {
        const entry = `index.html#${ref}`;
        // const entry = `#${ref}`;
        // update the URL
        history.pushState({ref},"",entry);
        // console.log('ref')
        // console.log(ref)

    }
};
addEventListener("popstate", function (e) {
    if (e.state.ref !== null) {
        gotoRef(e.state.ref, false)//'false' is so it won't register it in the browser history
    } 
    else {
        gotoRef(defaultReference, false)
    }
});

// history.replaceState({ref:null},'','/')