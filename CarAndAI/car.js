class Car {
    constructor(x,y,width,height,maxSpeed = 10,ControlType){
        //Descriping the postion of car
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.acceleration = 12;
        this.mass = 240;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.usedBrain = ControlType=="AI";
        this.ControlType = ControlType
        if(ControlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        //elment of the class that themselfs are new class
        this.controls = new Controls(ControlType);
    }
    update(roadBoards,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#IsDamged(roadBoards,traffic)
        }
        if(this.sensor){
            this.sensor.update(roadBoards,traffic);
            const offset = this.sensor.readings.map(
                s=>s==null?0:(1-s.offset)
            );
            const outputs = NeuralNetwork.feedForward(offset,this.brain)
            if(this.usedBrain){
                this.controls.foward = outputs[0];
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }  

    #IsDamged(roadBoards,traffic){
        for(let i = 0; i < roadBoards.length; i++){
            if(polysIntersect(this.polygon,roadBoards[i])){
                return true
            }
        }
        for(let i = 0; i < traffic.length; i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true
            }
        }
        return false

    }

    #createPolygon(){
        const points = [];
        const radius = Math.hypot((this.height + this.width))/2
        const alpha = Math.atan2(this.width,this.height)
        points.push({
            x:this.x-Math.sin(this.angle - alpha)*radius,
            y:this.y-Math.cos(this.angle - alpha)*radius

        });
        points.push({
            x:this.x-Math.sin(this.angle + alpha)*radius,
            y:this.y-Math.cos(this.angle + alpha)*radius

        });
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle - alpha)*radius,
            y:this.y-Math.cos(Math.PI + this.angle - alpha)*radius

        });
        points.push({
            x:this.x-Math.sin(Math.PI + this.angle + alpha)*radius,
            y:this.y-Math.cos(Math.PI + this.angle + alpha)*radius

        });
        return points;
    }


    #move(){
        if(this.controls.foward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        if(this.speed>this.maxSpeed){
            this.speed = this.maxSpeed;

        }
        if(this.speed < - this.maxSpeed/2){
            this.speed = - this.maxSpeed/2;

        }
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        if(this.speed != 0){
            const flip = this.speed>0?1:-1
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
            if(this.controls.left){
                this.angle += 0.03 * flip;
        }
        }
        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed 
    }
    draw(ctx,color,drawSensor=false){
        if(this.damaged){
            ctx.fillStyle = "grey"
        }else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i = 1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}