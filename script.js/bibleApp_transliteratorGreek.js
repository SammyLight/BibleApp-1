/* GREEK TRANSLITERATOR */
// //https://gist.github.com/eyy/7d37f1a0a9debf0286efaa3aa4651c3c
// //Transliterates ENGLISH TO GREEK which is not what I want
// let r = 'αβσδεφγ῾ικλμνοπρστυξυζηω'.split('').reduce((o,curr,i) => {o['abcdefghiklmnoprstuxyzēō'[i]] = curr;return o}, {})
// function gr(s) { return s.replace('th','θ').replace('ch','χ').replace(/./gui, a=>r[a]||a).replace(/σ /g, 'ς ') }
// // replace selected
// s=window.getSelection()
// t=s.toString()
// p=s.focusNode.parentNode;p.innerHTML=p.innerHTML.replace(t, gr(t))


/* TRANSLITERAIOTN */
/* 
'ΑΒΓΔΕΖΗΙΚΛΜΝΞΟΠΡΣΤΥΩ'
'ABGDEZHIKLMNXOPRSTYŌ'
'αβγδεζηικλμνξοπρσςτυω'
'abgdezhiklmnxoprsstyō'
s.replace('\bυ','hu')
s.replace('\bΥ','Hu')
Α	α	a
Β	β	b
Γ	γ	g
Δ	δ	d
Ε	ε	e
Ζ	ζ	z
Η	η	h ē
Θ	θ	th
Ι	ι	i
Κ	κ	k
Λ	λ	l
Μ	μ	m
Ν	ν	n
Ξ	ξ	x
Ο	ο	o
Π	π	p
Ρ	ρ	r
Σ	σ,ς	s
Τ	τ	t
Υ	υ	u (hu when it is the first letter)
Φ	φ	ph
Χ	χ	ch
Ψ	ψ	ps
Ω	ω	ō
 */
/* const greekTransliterationReplacementSET = {
    "αυ": "au",
    "\bυ": "hu",
    "Α": "A",
    "Β": "B",
    "Γ": "G",
    "Δ": "D",
    "Ε": "E",
    "Ζ": "Z",
    "Η": "H",
    "Ι": "I",
    "Κ": "K",
    "Λ": "L",
    "Μ": "M",
    "Ν": "N",
    "Ξ": "X",
    "Ο": "O",
    "Π": "P",
    "Ρ": "R",
    "Σ": "S",
    "Τ": "T",
    "Υ": "Y",
    "Ω": "Ō",
    "α": "a",
    "β": "b",
    "γ": "g",
    "δ": "d",
    "ε": "e",
    "ζ": "z",
    "η": "h",
    "ι": "i",
    "κ": "k",
    "λ": "l",
    "μ": "m",
    "ν": "n",
    "ξ": "x",
    "ο": "o",
    "π": "p",
    "ρ": "r",
    "σ": "s",
    "ς": "s",
    "τ": "t",
    "υ": "y",
    "ω": "ō"
} */

const greekTransliterationReplacementSET = {
    "au": ["αυ"],
    "hu": ["\bυ"],
    "au": ["αυ"],
    "eu": ["ευ"],
    "ou": ["ου"],
    "hu": ["ηυ"],
    "me": ["μὴ"],
    "ui": ["υι"],
    "ng": ["γγ"],
    "nch": ["γχ"],
    "nk": ["γκ"],
    "nx": ["γξ"],
    "th": ["θ"],
    "Th": ["Θ"],
    "ph": ["φ"],
    "Ph": ["Φ"],
    "ch": ["χ"],
    "Ch": ["Χ"],
    "ps": ["ψ"],
    "Ps": ["Ψ"],
    "A": ["Α"],
    "B": ["Β"],
    "G": ["Γ"],
    "D": ["Δ"],
    "E": ["Ε","Ἔ"],
    "Z": ["Ζ"],
    "H": ["Η"],
    "I": ["Ι"],
    "K": ["Κ"],
    "L": ["Λ"],
    "M": ["Μ"],
    "N": ["Ν"],
    "X": ["Ξ"],
    "O": ["Ο"],
    "P": ["Π"],
    "R": ["Ρ"],
    "S": ["Σ"],
    "T": ["Τ"],
    "Y": ["Υ"],
    "Ō": ["Ω"],
    "a": ["α","ὰ","ά","ᾶ","ᾰ","ᾱ"],
    "b": ["β"],
    "g": ["γ"],
    "d": ["δ"],
    "e": ["ε","ὲ","ἐ","ἔ"],
    "é": ["ἐ"],
    "z": ["ζ"],
    "ḗ": ["ή"],
    "h": ["η","ὴ","ή","ῆ","ῃ"],
    "ḗ": ["ή"],
    "i": ["ι","ὶ","ϊ",'ΐ',"ῖ","ῐ","ῑ"],
    "k": ["κ"],
    "l": ["λ"],
    "m": ["μ"],
    "n": ["ν"],
    "x": ["ξ"],
    "o": ["ο","ὸ"],
    "p": ["π"],
    "r": ["ρ"],
    "s": ["σ","ς"],
    "t": ["τ"],
    "y": ["υ","ὺ","ύ","ϋ","ΰ","ῠ","ῡ"],
    "û": ["ῦ"],
    "ō": ["ω","ὧ","ῷ","ώ","ὼ","ῶ","ὠ"]
}

/* GREEK TRANSLITERATOR */
// 'ΑΒΓΔΕΖΗΙΚΛΜΝΞΟΠΡΣΤΥΩαβγδεζηικλμνξοπρσςτυω'
// 'ABGDEZHIKLMNXOPRSTYŌabgdezhiklmnxoprsstyō'

// Create Object from 2 Arrays
//FROM: (https://bobbyhadz.com/blog/javascript-create-object-from-two-arrays#:~:text=To%20create%20an%20object%20from%20two%20arrays%3A%201,iteration%2C%20assign%20the%20key-value%20pair%20to%20an%20object.)
// function generateGreekTransliterationReplacementSET() {
//     let greekLetters = ['αυ', '\bυ', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Ω', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'ς', 'τ', 'υ', 'ω'];
//     let replacementLetters = ['au', 'hu', 'A', 'B', 'G', 'D', 'E', 'Z', 'H', 'I', 'K', 'L', 'M', 'N', 'X', 'O', 'P', 'R', 'S', 'T', 'Y', 'Ō', 'a', 'b', 'g', 'd', 'e', 'z', 'h', 'i', 'k', 'l', 'm', 'n', 'x', 'o', 'p', 'r', 's', 's', 't', 'y', 'ō'];
//     let greekTransliterationReplacementSET = {};
//     greekLetters.forEach((element, index) => {
//         greekTransliterationReplacementSET[element] = replacementLetters[index];
//     });
//     return greekTransliterationReplacementSET;
// }
//Match key and replace with value
function keyValueReplacer(str, keyValueReplacementObj=greekTransliterationReplacementSET) {
    //GREEK to ENGLISH
    /* For Word Begining */
    str = str.replace(new RegExp(`\\b[υὑ]`, 'g'), 'hu')
    Object.keys(keyValueReplacementObj).forEach(k => keyValueReplacementObj[k].forEach(function (item) {
        str = str.replace(new RegExp(`${item}`, 'g'), k)
    }));
    // console.log(str);
    let transliteration=str;
    return transliteration
}
// keyValueReplacer()
