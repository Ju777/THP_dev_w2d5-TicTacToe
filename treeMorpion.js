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

            // Il ne nous reste plus qu'à créer les noeuds correspondants à chaque nouvelle option de jeu.
            this.branchesMaking(this.root, optionsSubArray);

        } else {
            console.log("Le noeud root fournit existe déjà, controllez vos données.");
        }
    }
    
    branchesMaking(parentNode, parentSubarray) {

        // La fonction étant récursive, il faut un base case.
        // Base case
        if(parentSubarray.length === 1) {
            // console.log("ATTENTION : ACTIVATION DU BASE CASE !");
            parentNode.children = parentSubarray;
            return;
        } else {
            for(let i = 0 ; i < parentSubarray.length ; i++) {
                // Création de l'enfant : avec son cell et son round, mais pas encore ses propres enfant.
                parentNode.children[i] = new Node(parentSubarray[i], parentNode.round + 1, []);                
            }

            for(let i = 0 ; i < parentNode.children.length ; i++) {
                 let childSubarray = [];
                parentSubarray.map(item => {                
                    if(!this.arrayEquals(item, parentNode.children[i].cell)){
                        childSubarray.push(item);                            
                    }
                });
                
                this.branchesMaking(parentNode.children[i], childSubarray);
                
            }
        }
    }
    
    findGameOptions(playedNode) {
        // Ecran d'accueil de la fonction de recherche de coups à jouer
        console.clear();
        console.log("\n" + "*".repeat(50));
        console.log(`\t ~ RECHERCHE DE COUPS A JOUER ~\n`);
        console.log("\tRappel des cases déjà jouées :");
        console.log(this.chosenCells);
        console.log("*".repeat(50));

        // Demande du prochain coupé à jouer.

        console.log(`\n\tQuel est le ${playedNode.round + 1}e coup joué (après [${playedNode.cell}]) ?`);
        
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
                // Rafraîchissment de l'écran
                console.clear();
                console.log("\n" + "*".repeat(50));
                console.log(`\t ~ RECHERCHE DE COUPS A JOUER ~\n`);
                console.log("\tRappel des cases déjà jouées :");
                console.log(this.chosenCells);
                console.log("*".repeat(50));

                console.log(`\n\tAprès [${nextCell}] comme ${playedNode.round + 1}e coup, les cases disponibles sont :\n`);
                console.log(currentRoundOptions[i].children);
                nextNode = currentRoundOptions[i];
                enter(); 
                // Base case
                if(playedNode.round + 1 === 8) {
                    console.log("\tEt ce prochain coup terminera la partie <3 !");
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
                console.log("\nCette case a déjà été jouée, jouez ailleurs.");
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

    console.log("\n\tAppuyer sur ENTER pour lancer la création d'un arbre de morpion qui démarre à la case " + startingCell + ".");
    enter();
    tree.rootNodeCreation(startingCell);
    // console.log("\n\tOpération terminée, quelques affichages d'informations vont suivre.");
    console.log("\n\tOpération terminée.\n\t- Quelques informations sur l'arbre vont suivre.\n\t- Appuyer sur 'r' pour les passer et accéder directement à la recherche des options de jeu.\n");

    let choice = prompt("\t 'r' ou ENTER > ");
    switch (choice) {
        case "r":
            return tree;
        default:   
        break;
    }

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
    console.log("\tAFFICHAGE DES ENFANTS DU NOEUD ROOT\n-> console.log(tree.root.children);");
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children);
    enter();

    console.clear();
    console.log("\n" + "*".repeat(50));
    console.log(`\tAFFICHAGE DES ENFANTS DU PREMIER ENFANT DU NOEUD ROOT :\n-> console.log(tree.root.children[0]);`);
    console.log("*".repeat(50));
    enter();
    console.log(tree.root.children[0].children);
    enter();

    return tree;
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
