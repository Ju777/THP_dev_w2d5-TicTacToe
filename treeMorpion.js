const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

// L'ordre des éléments du tableau suivant est à conserver tel quel. Il conditionne TOUTES les recherches de noeuds.
const allCells = [[0,0], [1,0], [2,0], [0,1], [1,1], [2,1], [0,2], [1,2], [2,2]];

function enter() {
    return prompt("[ENTER]");
}


class Node{
    constructor(cell, round, ...array){
        // A Node is representing a cell.
        this.cell = cell;
        // A Node is chosen at any round of the game. 
        this.round = round;
        // A Node has an unknown number of children nodes, from 0 to 8. Each node is one possible option to play.
        this.children = [...array];
    }
}

class Tree{
    constructor(){
        this.root = null;
        this.chosenCells = [];
    }

    // Initialisation du noeud racine càd la première cellule jouée, nous sommes donc au round 1.
    rootNodeCreation(startingCell) {

        if(this.root === null) {

            // La création du noeud racine est ici :
            this.root = new Node(startingCell, 1, []);
            this.chosenCells.push(this.root.cell);

            // Il ne nous manque plus que les enfants de ce noeud racine, c'est à dire toutes les cellules encore lires.
            // subArray = un tableau de toutes les cellules autres que parentNode.Cell .
            let optionsSubArray = [];
            allCells.map(item => {
                if(!this.arrayEquals(item, startingCell)){
                    optionsSubArray.push(item)
                }
            });

            // Log de vérif
            // console.log("optionsSubArray => ");
            // console.log(optionsSubArray);
            // enter();

            // Il ne nous reste plus qu'à créer les noeuds correspondants à chaque nouvelle option de jeu.
            this.branchesMaking(this.root, optionsSubArray);

        } else {
            console.log("Le noeud root fournit existe déjà, controllez vos données.");
        }
    }
    
    branchesMaking(parentNode, parentSubarray) {
    //Log de vérif
    // console.clear();
    // console.log("\n" + "*".repeat(50));
    // console.log(`BRANCHEMAKINGS : NOUVELLE ENTREE -> round n° ${parentNode.round} : cell [${parentNode.cell}]\n\nSous-tableau : `);
    // console.log(parentSubarray);
    // console.log("*".repeat(50));
    // enter();

        // La fonction étant récursive, il faut un base case.
        // Base case
        if(parentSubarray.length === 1) {
            // console.log("ATTENTION : ACTIVATION DU BASE CASE !");
            parentNode.children = parentSubarray;
            return;
        } else {
            for(let i = 0 ; i < parentSubarray.length ; i++) {
                // Création de l'enfant : avec son cell et son round, mais pas encore ses propres enfant.
                // console.log(`\nBOUCLE A : ITERATION n°${i}`);
                // console.log(`\nPour parentNode.children[${i}] `);
                parentNode.children[i] = new Node(parentSubarray[i], parentNode.round + 1, []);                
                // console.log("on a créé le noeud enfant : ");
                // console.log(parentNode.children[i]);
                // enter();
            }

            for(let i = 0 ; i < parentNode.children.length ; i++) {
                // console.log(`\nBOUCLE B : ITERATION n°${i}`);
                // console.log(`\nPour parentNode.children[${i}] `);
                let childSubarray = [];
                parentSubarray.map(item => {                
                    if(!this.arrayEquals(item, parentNode.children[i].cell)){
                        childSubarray.push(item);                            
                    }
                });
                // console.log("\nOn a créé le sous-tableau -> childSubarray = ")
                // console.log(childSubarray);
                // enter();
                
                this.branchesMaking(parentNode.children[i], childSubarray);
                
            }
        }
    }
    
    findGameOptions(playedNode) {
        // Demande du prochain coupé à jouer.
        console.log(`\nQuel est le ${playedNode.round + 1}e coup joué (après [${playedNode.cell}]) ?\n`);
        let nextCell = choseCell();
    
        // Validation : la saisie doit être une cellule qui qui n'a déjà été jouée.
        while (!this.cellValidation(nextCell)) {
            nextCell = choseCell();
        }
    
        // Si elle est valide, on l'ajoute aux tree.chosenCells.
        this.chosenCells.push(nextCell);
        // console.log(tree.chosenCells);
    
        // Arrivé à ce stade, nous devons récupérer le noeud du coup joué, pour les afficher comme prochaines cases disponibles.
        let currentRoundOptions = [...playedNode.children];
        let nextNode;
        for(let i = 0 ; i < currentRoundOptions.length ; i++) {
            if(this.arrayEquals(currentRoundOptions[i].cell, nextCell)) {
                console.clear();
                console.log(`\n\tAprès [${nextCell}] comme ${playedNode.round + 1}e coup, les cases disponibles sont :\n`);
                enter();
                console.log(currentRoundOptions[i].children);
                nextNode = currentRoundOptions[i];
                enter(); 
                // Base case
                if(playedNode.round + 1 === 8) {
                    console.log("Et ce prochain coup terminera la partie <3 !");
                    enter();
                    return nextNode;
                }      
            }
        }
        this.findGameOptions(nextNode);
        return nextNode;
    }

    cellValidation(input) {

        for(let i = 0 ; i < this.chosenCells.length ; i++) {
            if(this.arrayEquals(input, this.chosenCells[i])) {
                console.log("Cette case a déjà été jouée, jouez ailleurs.");
                enter();
                return false;
            }
        }
        return true;
    }

    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}

function welcomeScreen() {
    // Ecran d'accueil
    console.clear();
    console.log("\n" + "*".repeat(40));
    console.log("\t ~ ARBRE DE MORPION ~");
    console.log("*".repeat(40) + "\n\n");
    enter();
}

function choseCell() {
    let col;
    while(col !== "0" && col !== "1" && col !== "2") {
        col = prompt("Colonne : 0, 1 ou 2 > ");
    }

    let line;
    while(line !== "0" && line !== "1" && line !== "2") {
        line = prompt("Ligne : 0, 1 ou 2 > ");
    }

    return [parseInt(col), parseInt(line)];
}

function treeCreation(startingCell) {
    let tree = new Tree();

    console.log("\nAppuyer sur ENTER pour lancer la création d'un arbre de morpion qui démarre à la case " + startingCell + ".");
    enter();
    tree.rootNodeCreation(startingCell);
    console.log("Opération terminée => veuillez consulter les affichages qui vont suivre.");
    enter();


    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("\tAFFICHAGE DE LOBJET 'ARBRE'\n-> console.log(tree);");
    console.log("*".repeat(50));
    enter();
    console.log(tree);
    enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("\tAFFICHAGE DE L'OBJET 'NOEUD RACINE' \n-> console.log(tree.root);");
    console.log("*".repeat(50));
    enter();
    console.log(tree.root);
    enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("\tAFFICHAGE DES ENFANTS DU ROOT\n-> console.log(tree.root.children);");
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children);
    enter();

    // console.clear();
    // console.log("\n" + "*".repeat(50));
    // console.log(`AFFICHAGE DE round ${tree.root.children[0].round}, cellule ${tree.root.children[0].cell} -> console.log(tree.root.children[0]);`);
    // console.log("*".repeat(50));
    // enter();
    // console.log(tree.root.children[0]);
    // enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log(`\tAFFICHAGE DES ENFANTS DU PREMIER ENFANT DU ROOT :\n-> console.log(tree.root.children[0]);`);
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children[0].children);
    enter();

    return tree;
}

function findNode() {
    // Définir le root node.
    console.log("\nQuel est le 1er coup joué dans cette partie ?");
    let startingCell = choseCell();
    // Création de l'arbre des possibilités de jeux à partir de ce premier coup (starting cell).
    let tree = treeCreation(startingCell);   

    // Ecran d'accueil de la fonction de recherche de coups à jouer
    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log(`\t ~ RECHERCHE DE COUPS A JOUER ~`);
    console.log("*".repeat(50));
    enter();
    
    console.log(`\n\tAprès [${tree.root.cell}] comme 1er coup, les cases disponibles sont :\n`);
    enter();
    console.log(tree.root.children);
    enter();

    // let round2Node = round2Options(tree, tree.root);
    // let round3Node = round3Options(tree, round2Node);
    // let round4Node = round4Options(tree, round3Node);
    // let round5Node = round5Options(tree, round4Node);
    // let round6Node = round6Options(tree, round5Node);
    // let round7Node = round7Options(tree, round6Node);
    // let round8Node = round8Options(tree, round7Node);
    recurs(tree, tree.root);


    // VIEUX CODE DE VERIF de la cohérence de l'arbre, via des recherches manuelles successives.
    // console.clear();
    // console.log("\n" + "*".repeat(50));
    // console.log(`RECHERCHE : on recherche les options de jeu pour le noeud [0,0] round 9`);
    // console.log("*".repeat(50));
    // enter();
    // console.log(tree.root.children[4].children[2].children[3].children[2].children[2].children[2].children[1].children[0]);
    // enter();
}

// function recurs(tree, playedNode) {
//     // Demande du prochain coupé à jouer.
//     console.log(`\nQuel est le ${playedNode.round + 1}e coup joué (après [${playedNode.cell}]) ?\n`);
//     let nextCell = choseCell();

//     // Validation : la saisie doit être une cellule qui qui n'a déjà été jouée.
//     while (!inputValidation(nextCell, tree)) {
//         nextCell = choseCell();
//     }

//     // Si elle est valide, on l'ajoute aux tree.chosenCells.
//     tree.chosenCells.push(nextCell);
//     // console.log(tree.chosenCells);

//     // Arrivé à ce stade, nous devons récupérer le noeud du coup joué, pour les afficher comme prochaines cases disponibles.
//     let currentRoundOptions = [...playedNode.children];
//     let nextNode;
//     for(let i = 0 ; i < currentRoundOptions.length ; i++) {
//         if(tree.arrayEquals(currentRoundOptions[i].cell, nextCell)) {
//             console.clear();
//             console.log(`\n\tAprès [${nextCell}] comme ${playedNode.round + 1}e coup, les cases disponibles sont :\n`);
//             enter();
//             console.log(currentRoundOptions[i].children);
//             nextNode = currentRoundOptions[i];
//             enter(); 
//             // Base case
//             if(playedNode.round + 1 === 8) {
//                 console.log("Et ce prochain coup terminera la partie <3 !");
//                 enter();
//                 return nextNode;
//             }      
//         }
//     }
//     recurs(tree, nextNode);
//     return nextNode;
// }

function round2Options(tree, rootNode) {
    // Options de jeu après le 2e coup joué.
    console.log(`\nQuel est le 2e coup joué (après [${rootNode.cell}]) ?\n`);
    let second = choseCell();
    
    // Validation : la saisie doit être une cellule qui fait partie du tableau du noeud, ici : root.

    while (!inputValidation(second, tree)) {
        second = choseCell();
    } 
        
    // Si elle est valide, on l'ajoute aux tree.chosenCells.
    tree.chosenCells.push(second);
   
    // Arrivé à ce stade, nous devons récupérer le noeud de ce 2e coup.
    let round2Options = [...rootNode.children];
    let result;
    for(let i = 0 ; i < round2Options.length ; i++) {
        if(tree.arrayEquals(round2Options[i].cell, second)) {
            console.clear();
            console.log(`\n\tAprès [${second}] comme 2e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round2Options[i].children);
            result = round2Options[i];
            enter(); 
        }
    }
    return result;   
}

function round3Options(tree, round2Node) {
    // Options de jeu après le 3e coup joué.
    console.log(`\nQuel est le 3e coup joué (après [${round2Node.cell}])?\n`);
    let third = choseCell();

    while (!inputValidation(third, tree)) {
        third = choseCell();
    } 

    tree.chosenCells.push(third);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 3e coup.
    let round3Options = [...round2Node.children];
    let result;
    for(let i = 0 ; i < round3Options.length ; i++) {
        if(tree.arrayEquals(round3Options[i].cell, third)) {
            console.clear();
            console.log(`\n\tAprès [${third}] comme 3e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round3Options[i].children);
            result = round3Options[i];
            enter(); 
        }
    }
    return result;   
}

function round4Options(tree, round3Node) {
    // Options de jeu après le 4e coup joué.
    console.log(`\nQuel est le 4e coup joué (après [${round3Node.cell}])?\n`);
    let fourth = choseCell();

    while (!inputValidation(fourth, tree)) {
        fourth = choseCell();
    } 

    tree.chosenCells.push(fourth);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 4e coup.
    let round4Options = [...round3Node.children];
    let result;
    for(let i = 0 ; i < round4Options.length ; i++) {
        if(tree.arrayEquals(round4Options[i].cell, fourth)) {
            console.clear();
            console.log(`\n\tAprès [${fourth}] comme 4e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round4Options[i].children);
            result = round4Options[i];
            enter(); 
        }
    }
    return result;   
}

function round5Options(tree, round4Node) {
    // Options de jeu après le 5e coup joué.
    console.log(`\nQuel est le 5e coup joué (après [${round4Node.cell}])?\n`);
    let fifth = choseCell();

    while (!inputValidation(fifth, tree)) {
        fifth = choseCell();
    } 

    tree.chosenCells.push(fifth);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 5e coup.
    let round5Options = [...round4Node.children];
    let result;
    for(let i = 0 ; i < round5Options.length ; i++) {
        if(tree.arrayEquals(round5Options[i].cell, fifth)) {
            console.clear();
            console.log(`\n\tAprès [${fifth}] comme 5e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round5Options[i].children);
            result = round5Options[i];
            enter(); 
        }
    }
    return result;   
}

function round6Options(tree, round5Node) {
    // Options de jeu après le 6e coup joué.
    console.log(`\nQuel est le 6e coup joué (après [${round5Node.cell}])?\n`);
    let sixth = choseCell();

    while (!inputValidation(sixth, tree)) {
        sixth = choseCell();
    } 

    tree.chosenCells.push(sixth);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 6e coup.
    let round6Options = [...round5Node.children];
    let result;
    for(let i = 0 ; i < round6Options.length ; i++) {
        if(tree.arrayEquals(round6Options[i].cell, sixth)) {
            console.clear();
            console.log(`\n\tAprès [${sixth}] comme 6e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round6Options[i].children);
            result = round6Options[i];
            enter(); 
        }
    }
    return result;   
}

function round7Options(tree, round6Node) {
    // Options de jeu après le 7e coup joué.
    console.log(`\nQuel est le 7e coup joué (après [${round6Node.cell}])?\n`);
    let seventh = choseCell();

    while (!inputValidation(seventh, tree)) {
        seventh = choseCell();
    } 

    tree.chosenCells.push(seventh);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 7e coup.
    let round7Options = [...round6Node.children];
    let result;
    for(let i = 0 ; i < round7Options.length ; i++) {
        if(tree.arrayEquals(round7Options[i].cell, seventh)) {
            console.clear();
            console.log(`\n\tAprès [${seventh}] comme 7e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round7Options[i].children);
            result = round7Options[i];
            enter(); 
        }
    }
    return result;   
}

function round8Options(tree, round7Node) {
    // Options de jeu après le 8e coup joué.
    console.log(`\nQuel est le 8e coup joué (après [${round7Node.cell}])?\n`);
    let eighth = choseCell();

    while (!inputValidation(eighth, tree)) {
        eighth = choseCell();
    } 

    tree.chosenCells.push(eighth);

    // Arrivé à ce stade, nous devons récupérer le noeud de ce 8e coup.
    let round8Options = [...round7Node.children];
    let result;
    for(let i = 0 ; i < round8Options.length ; i++) {
        if(tree.arrayEquals(round8Options[i].cell, eighth)) {
            console.clear();
            console.log(`\n\tAprès [${eighth}] comme 8e coup, les cases disponibles sont :\n`);
            enter();
            console.log(round8Options[i].children);
            console.log("\n\tEt ce coup terminera la partie <3 !")
            result = round8Options[i];
            enter(); 
        }
    }
    return result;   
}

function inputValidation(input, tree) {

    for(let i = 0 ; i < tree.chosenCells.length ; i++) {
        if(tree.arrayEquals(input, tree.chosenCells[i])) {
            console.log("Cette case a déjà été jouée, jouez ailleurs.");
            enter();
            return false;
        }
    }
    return true;
}

function perform() {
    welcomeScreen();
    //VERSION sans récursivité et fonctions "externes" à la classe Tree
    // findNode();
    
    // VERSION AVEC RECURSIVITE ET FONCTION DE CLASSE
    // Définir le root node.
    console.log("\nQuel est le 1er coup joué dans cette partie ?");
    let startingCell = choseCell();
    // Création de l'arbre des possibilités de jeux à partir de ce premier coup (starting cell).
    let tree = treeCreation(startingCell);
    tree.findGameOptions(tree.root);
}

perform();
