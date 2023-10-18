export class KenStage {
    constructor() {
        this.image = document.querySelector('img[alt="kenStage"]');
    }
    
    update() {}

    draw(context){
        context.drawImage(this.image, 0, 0);
    }
}