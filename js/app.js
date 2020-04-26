import gsap from "../node_modules/gsap/all.js";
// import { InertiaPlugin } from "../node_modules/gsap/InertiaPlugin.js";
import { Draggable } from "../node_modules/gsap/Draggable.js";
import { JsonLoader } from "./JsonLoader.js";
import { Score } from "./Score.js"
import { Level } from "./Level.js"
import { Question } from "./Question.js"
import { Word } from "./Word.js"
import { Group } from "./Group.js"
import { GroupCollection } from "./GroupCollection.js"
import { Category } from "./Category.js"
import { Drag } from "./Drag.js"
import { Grid } from "./Grid.js"
import { Target } from "./Target.js"
import { skip, submit } from "./helper.js"

// gsap.registerPlugin(InertiaPlugin);

gsap.registerPlugin(Draggable);

const scene = document.querySelector("#scene")
const targetEl = scene.querySelector("#target")
const scoreNumberEl = document.querySelector("#score-number")
const scoreTotalEl = document.querySelector("#score-total")
const resetButton = document.querySelector("#reset-button")
const submitButton = document.querySelector("#submit-button")
const questionEl = scene.querySelector("#question")
const wordTemplate = document.querySelector("#word-template g")

const gridGutterX = 24;
const gridGutterY = 6;
const gridWidth = (scene.clientWidth / 7) - gridGutterX;
const gridHeight = 32;

const groupCollection = new GroupCollection()
const question = new Question(questionEl)
const target = new Target(targetEl)
const score = new Score(scoreNumberEl, scoreTotalEl);
const jsonLoader = new JsonLoader();

gsap.set(targetEl, {
    width: gridWidth * 7 + gridGutterX * 6,
    height: gridHeight
})

function makeDraggable() {

    const wordWrappers = document.querySelectorAll(".word-wrapper")
    Draggable.create(wordWrappers,
        {
            type: "x,y",
            onDrag: function (e) {
                if (this.hitTest("#target")) {
                    targetEl.classList.add("hit")
                }
                else {
                    targetEl.classList.remove("hit")
                }

            },
            onDragEnd: function (e) {
                if (this.hitTest("#target")) {
                    Word.setAnswerClassByElement(this.target)
                }
                else {
                    Word.removeAnswerClassByElement(this.target)
                }
                targetEl.classList.remove("hit")
            },
            liveSnap: {
                x: function (value) {
                    return Math.round(value / (gridWidth + gridGutterX)) * (gridWidth + gridGutterX);
                },
                y: function (value) {
                    return Math.round(value / (gridHeight + gridGutterY)) * (gridHeight + gridGutterY);
                }
            }
        }
    );
}

function init(wordData) {

    wordData.forEach(groupData => {
        const groupName = groupData.group
        const group = new Group(scene, groupData.group, groupData.groupSelector, gridWidth, gridGutterX)
        groupCollection.addGroup(group)
        groupData.words.forEach(wordText => {
            const word = new Word(wordTemplate, groupName, wordText, gridWidth, gridHeight, gridGutterX, gridGutterY)
            group.addWord(word);
        })
    })

    // for debugging
    window.collection = groupCollection

    const groupY = targetEl.getBBox().y + targetEl.getBBox().height + gridGutterY
    groupCollection.positionGroups(scene, groupY)

    groupCollection.collection.forEach(group => {
        group.appendWords();
        group.positionWords()
    })
    makeDraggable()
}

const wordsLoader = jsonLoader.load('json/words.json')
const questionLoader = jsonLoader.load('json/questions-answers.json')

Promise.all([wordsLoader, questionLoader])
    .then(([wordsData, questionData]) => {
        init(wordsData)
        score.setMax(questionData.length)
        question.setCollection(questionData)
        question.next()
    })

resetButton.addEventListener("click", e => {
    skip(groupCollection, question)
})

submitButton.addEventListener("click", e => {
    submit(target, question, score, groupCollection)
})
