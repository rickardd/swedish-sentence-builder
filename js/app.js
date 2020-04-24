import gsap from "../node_modules/gsap/all.js";
import { Draggable } from "../node_modules/gsap/Draggable.js";
import { Word } from "./Word.js";
import { WordGroup } from "./WordGroup.js";
import { JsonLoader } from "./JsonLoader.js";

// gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable);

function makeDraggable() {
    var gridWidth = 10;
    var gridHeight = 10;
    const wordRects = document.querySelectorAll(".test")
    Draggable.create(wordRects,
        {
            type: "x,y",
            // edgeResistance: 0.65,
            // bounds: "#target",
            // lockAxis: true,
            // inertia: true,
            // liveSnap: true,
            // snap: {
            //     x: function (endValue) {
            //         return Math.round(endValue / gridWidth) * gridWidth;
            //     },
            //     y: function (endValue) {
            //         return Math.round(endValue / gridHeight) * gridHeight;
            //     }
            // }
        }
    );
}

// const getEl = document.querySelector;
// const getEls = document.querySelectorAll;

// templates
const wordTemplate = document.querySelector("#word-template")

// scene
const scene = document.querySelector("#scene")

function createWordEl(groupName, text) {
    const wordClone = wordTemplate.content.cloneNode(true); // true, clones text. Maybe it should be false. 
    const rectEl = wordClone.querySelector("rect")
    const textEl = wordClone.querySelector("text")
    rectEl.classList.add(groupName)
    textEl.innerHTML = text
    return wordClone
}

/**
 * Appends a word to a group
 * 
 * @param {Element | String} groupEl 
 * @param {Element} wordEl 
 */
function addWordToGroup(groupEl, wordEl) {
    if (typeof groupEl === 'string') {
        groupEl = scene.querySelector(groupEl)
    }
    groupEl.appendChild(wordEl)
}

function addWordsToGroup(wordData) {
    wordData.forEach(data => {
        if (!data.words)
            return

        let group = data.group
        let groupSelector = data.groupSelector
        data.words.forEach(word => {
            const wordEl = createWordEl(group, word)
            addWordToGroup(groupSelector, wordEl)
        });
    });
}

const groupWidth = 100; // should be dynamic value

function positionGroups(wordData) {
    wordData.forEach(({ group, groupSelector: selector }, i) => {
        const el = scene.querySelector(selector)
        gsap.set(el, {
            x: i * (groupWidth + 24),
            y: 200,
        })
    });
}

const wordHeight = 40; // should be dynamic value

function positionWords() {
    const groups = scene.querySelectorAll(".word-group")
    groups.forEach(group => {
        const words = group.querySelectorAll(".word-wrapper")

        words.forEach((word, i) => {
            word.setAttribute("y", i * (wordHeight + 24))
        })
        // For some reason gsap doesnt want to positioning the svg element
        // gsap.to(words, {
        //     // y: i => {
        //     //     console.log(i, words)
        //     //     return i * (100 + 24)
        //     // },
        //     y: 200
        // })
    });

}

function init(wordData) {
    positionGroups(wordData)
    addWordsToGroup(wordData)
    positionWords()
    makeDraggable()
}

const jsonLoader = new JsonLoader();

jsonLoader.load('json/words.json')
    .then(wordsData => {
        init(wordsData)
    })