import gsap from "../node_modules/gsap/all.js";
// import { InertiaPlugin } from "../node_modules/gsap/InertiaPlugin.js";
import { Draggable } from "../node_modules/gsap/Draggable.js";
import { Word } from "./Word.js";
import { WordGroup } from "./WordGroup.js";
import { JsonLoader } from "./JsonLoader.js";

// gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable);

const target = document.querySelector("#target")

const gridWidth = 100;
const gridHeight = 100;
const gridGutterX = 24;
const gridGutterY = 24;

let answers = []
let answer = ""

function updateAnswer() {
    const wordEls = scene.querySelectorAll(".is-answer");
    answers = []
    answer = ""

    wordEls.forEach(el => {
        const groupX = gsap.getProperty(el.closest(".word-group"), "x")
        const dX = gsap.getProperty(el, "x")
        const finalX = groupX + dX
        const index = (finalX / (gridWidth + gridGutterX))
        const text = el.querySelector("text").textContent
        answers[index] = text.trim()
    })
    answer = answers.join(" ").replace(/\s+/g, " ")
    console.log(answer)
}

function makeDraggable() {

    const wordWrappers = document.querySelectorAll(".word-wrapper")
    Draggable.create(wordWrappers,
        {
            type: "x,y",
            onDrag: function (e) {
                if (this.hitTest("#target")) {
                    target.classList.add("hit")
                }
                else {
                    target.classList.remove("hit")
                }

            },
            onDragEnd: function (e) {
                // const textEl = e.target.nodeName == "text"
                //     ? e.target.textContent
                //     : e.target.nextSibling.nextElementSibling.textContent

                const wordWrapper = this.target.closest(".word-wrapper")

                if (this.hitTest("#target")) {
                    wordWrapper.classList.add("is-answer")
                }
                else {
                    wordWrapper.classList.remove("is-answer")
                    target.classList.remove("hit")
                }
                updateAnswer()
            },
            liveSnap: {
                x: function (value) {
                    return Math.round(value / (gridWidth + gridGutterX)) * (gridWidth + gridGutterX);
                },
                y: function (value) {
                    return Math.round(value / (gridWidth + gridGutterX)) * (gridWidth + gridGutterX);
                }
            }
        }
    );
}

// const getEl = document.querySelector;
// const getEls = document.querySelectorAll;

// templates
const wordTemplate = document.querySelector("#word-template g")

// scene
const scene = document.querySelector("#scene")

function createWordEl(groupName, text) {
    const wordClone = wordTemplate.cloneNode(true); // true, clones text. Maybe it should be false. 
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

// const groupWidth = 100; // should be dynamic value - try $0.getBBox() to get <g> width

function positionGroups(wordData) {
    wordData.forEach(({ group, groupSelector: selector }, i) => {
        const el = scene.querySelector(selector)
        gsap.set(el, {
            x: i * (gridWidth + gridGutterX),
            y: 150 + gridGutterX,
        })
    });
}

const wordHeight = 40; // should be dynamic value

function positionWords() {
    const groups = scene.querySelectorAll(".word-group")
    groups.forEach(group => {
        const words = group.querySelectorAll(".word-wrapper")
        gsap.set(words, {
            // delay: 1,
            y: i => {
                return i * (100 + gridGutterY)
            },
        })
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