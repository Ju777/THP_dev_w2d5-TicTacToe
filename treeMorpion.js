const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });
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
    }

    // Initialisation du noeud racine càd la première cellule jouée, nous sommes donc au round 1.
    rootNodeCreation(startingCell) {

        if(this.root === null) {

            // La création du noeud racine est ici :
            this.root = new Node(startingCell, 1, []);

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
    // Choix de la case de départ
    console.log("\nA partie de quelle case de jeu [colonne, ligne] doit commencer cet arbre ?");

    let col;
    while(col !== "0" && col !== "1" && col !== "2") {
        col = prompt("Colonne 0, 1 ou 2 > ");
    }

    let line;
    while(line !== "0" && line !== "1" && line !== "2") {
        line = prompt("Ligne 0, 1 ou 2 > ");
    }

    return [parseInt(col), parseInt(line)];
}

function treeCreation(startingCell) {
    let tree = new Tree();

    console.log("\nAppuyer sur ENTER pour lancer la création d'un arbre de morpion qui démarre à la case " + startingCell);
    enter();
    tree.rootNodeCreation(startingCell);
    console.log("Opération terminée => veuillez consulter les affichages qui vont suivre.");
    enter();


    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("AFFICHAGE DE LOBJET 'ARBRE'\n-> console.log(tree);");
    console.log("*".repeat(50));
    enter();
    console.log(tree);
    enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("AFFICHAGE DU NOEUD RACINE tree.root \n-> console.log(tree.root);");
    console.log("*".repeat(50));
    enter();
    console.log(tree.root);
    enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log("AFFICHAGE DES ENFANTS DU ROOT\n-> console.log(tree.root.children);");
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
    console.log(`AFFICHAGE DES ENFANTS DU PREMIER ENFANT DU ROOT : cellule ${tree.root.children[0].cell}, round ${tree.root.children[0].round}\n-> console.log(tree.root.children[0]);`);
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children[0].children);
    enter();

    return tree;
}

function findNode(tree) {
    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log(`RECHERCHE : on recherche les options de jeu pour le noeud [2,1] round 4`);
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children[4].children[2].children[3].children);
    enter();
}

function perform() {
    welcomeScreen();
    let startingCell = choseCell();    
    let tree = treeCreation(startingCell);   
    findNode(tree); 
}

perform();
