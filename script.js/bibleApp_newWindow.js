let window2;
// let window2 = open('page2.html','winname','location=1');
function openNewWindow(){
    let newWindow;
    // window2 = open('page2.html','winname','width=200,height=200');
    window2 = open('page2.html','winname','location=1');
    window2.resizeTo(400, screen.height);
    window2.moveTo(screen.width-265, 0);
    window2.focus()
}
// function openNewWindow(){
//     let newWindow;
//     // newWindow = open('page2.html','winname','width=200,height=200');
//     newWindow = open('page2.html','winname','location=1');
//     newWindow.resizeTo(200, screen.height);
//     newWindow.moveTo(screen.width-265, 0);
//     return {newWindow}
// }
function win2bgColor(cl){
    if(!window2){return}
    window2.document.bgColor=cl;
    window2.focus()
}