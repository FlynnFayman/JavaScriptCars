//Thanks to Dr. Radu Mariescu-Istodor

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const carCtx = carCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const N = 100
const cars = generateCars(N)
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length;i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i!=0){
             NeuralNetwork.mutate(cars[i].brain,0.6)
        }

    }
}
const traffic = [
    new Car(road.getLaneCenter(1),-100,30,50,1,"DUMMY"),
    new Car(road.getLaneCenter(0),-300,30,50,1,"DUMMY"),
    new Car(road.getLaneCenter(2),-300,30,50,1,"DUMMY")
]

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,5,"AI"))
    }
    return cars;
}

//This animate function using the requestAnimationFrame is an infinte loop alowing anmation to accour
//
function animate(){
    for (let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
        
    for(let i = 0;i<cars.length;i++){
        cars[i].update(road.borders,traffic)
    }

    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx,"blue",true)
    carCtx.restore();
    requestAnimationFrame(animate);
}