import gsap from "../node_modules/gsap/all.js";

export class GroupCollection {
    constructor() {
        this.collection = []
    }

    /**
     * 
     * @param {Group} group 
     */
    addGroup(group) {
        this.collection.push(group)
    }

    /**
     * 
     * @param {Element} scene 
     * @param {Number} y 
     */
    positionGroups(scene, y) {
        this.collection.forEach((group, i) => {
            const el = scene.querySelector(group.selector)
            gsap.set(el, {
                x: i * (group.width + group.gutterX),
                y: y,
            })
        });
    }

    // resetWordClasses() {
    //     this.collection.forEach(group => {
    //         group.wordCollection.forEach(word => {
    //             word.resetAnswer()
    //         })
    //     })
    // }

    reset() {
        this.collection.forEach(group => {
            group.reset()
        })
    }
}
