let newOBJect = {};
for (key in crossReferences) {
    let oldRef = key.split('.');
    let shortBkNm = oldRef[0];

    newBkNm = getFUllBookName(shortBkNm);
    newOBJect[newBkNm + '.' + oldRef.splice(1).join('.')] = crossReferences[key]
}
// console.log(Object.keys(crossReferences).length)
// console.log(Object.keys(newOBJect).length)
// console.log(newOBJect)