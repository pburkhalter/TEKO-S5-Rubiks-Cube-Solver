const Move = {
    U: "U",
    UP: "U'",
    U2: "U2",

    D: "D",
    DP: "D'",
    D2: "D2",

    L: "L",
    LP: "L'",
    L2: "L2",

    R: "R",
    RP: "R'",
    R2: "R2",

    F: "F",
    FP: "F'",
    F2: "F2",

    B: "B",
    BP: "B'",
    B2: "B2",
}

export function convertToMove(input){
    if (Object.prototype.hasOwnProperty.call(Move, input)) {
        return Move[input];
    } else {
        return "Invalid move";
    }
}


export function convertMovesToSteps(moves) {
    return moves.map(move => new Step(move));
}



class Step {
    constructor(move) {
        this.move = move;
    }


    do() {
        return this.move;
    }

    undo() {
        //U
        if (this.move === Move.U) {
            return [Move.UP]
        }
        if (this.move === Move.UP) {
            return [Move.U]
        }
        if (this.move === Move.U2) {
            return [Move.UP, Move.UP]
        }

        //D
        if (this.move === Move.D) {
            return [Move.DP]
        }
        if (this.move === Move.DP) {
            return [Move.D]
        }
        if (this.move === Move.D2) {
            return [Move.DP, Move.DP]
        }

        //L
        if (this.move === Move.L) {
            return [Move.LP]
        }
        if (this.move === Move.LP) {
            return [Move.L]
        }
        if (this.move === Move.L2) {
            return [Move.LP, Move.LP]
        }

        //R
        if (this.move === Move.R) {
            return [Move.RP]
        }
        if (this.move === Move.RP) {
            return [Move.R]
        }
        if (this.move === Move.R2) {
            return [Move.RP, Move.RP]
        }

        //F
        if (this.move === Move.F) {
            return [Move.FP]
        }
        if (this.move === Move.FP) {
            return [Move.F]
        }
        if (this.move === Move.F2) {
            return [Move.FP, Move.FP]
        }

        //B
        if (this.move === Move.B) {
            return [Move.BP]
        }
        if (this.move === Move.BP) {
            return [Move.B]
        }
        if (this.move === Move.B2) {
            return [Move.BP, Move.BP]
        }
    }
}

export function initSteps(steps){
    return new Steps(steps);
}

class Steps {
    constructor(steps) {
        this.init(steps)
    }

    init(steps) {
        this.index = 0;
        this.steps = steps;
    }

    setSteps(steps){
        this.init(steps);
    }

    do() {
        if (this.index >= this.steps.length) {
            return null;
        }

        let move = this.steps[this.index].do();
        this.index += 1;

        return move;
    }

    undo() {
        console.log(this.index);
        console.log(this.steps.length);
        if (this.index <= 0) {
            return null;
        }

        this.index -= 1;
        return this.steps[this.index].undo()
    }
}

export default Steps;