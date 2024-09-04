    class Controls{
    constructor(ControlType){
        this.foward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        switch(ControlType){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.foward = true
                break;
        }
    }
    //The keybindings are 
    #addKeyboardListeners(){
        document.onkeydown= (event) => {
            switch (event.key){
            case "ArrowUp":
                this.foward = true
                break;
            case "ArrowLeft":
                this.left = true
                break;
            case "ArrowRight":
                this.right = true
                break;
            case "ArrowDown":
                this.reverse = true
            }
        }
        document.onkeyup = (event) => {
            switch (event.key){
            case "ArrowUp":
                this.foward = false
                break;
            case "ArrowLeft":
                this.left = false
                break;
            case "ArrowRight":
                this.right = false
                break;
            case "ArrowDown":
                this.reverse = false
            }
        }
    }}
