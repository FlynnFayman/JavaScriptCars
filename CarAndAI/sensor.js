class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 4;
        this.RayLength = 300;
        this.RaySpread = Math.PI/2;
        this.rays = [];
        this.readings=[];
    }
    //update adds the postion of the sensors rays
    update(roadBoards,traffic){
        this.#castRays();
        this.readings = [];
        //this is possible complexity is
        for(let i =0;i<this.rays.length;i++){
            this.readings.push(
                this.#getReadings(
                    this.rays[i],
                    roadBoards,
                    traffic
                )
            )
        }
    }
    #getReadings(ray,roadBoards,traffic){
        let touches=[];
        for(let i = 0;i < roadBoards.length; i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBoards[i][0],
                roadBoards[i][1]
            )
            if(touch){
                touches.push(touch)
            }
        }
        for(let i = 0;i < traffic.length; i++){
            const poly = traffic[i].polygon;
            for(let j = 0;j<poly.length;j++){
                const touch = getIntersection(
                                    ray[0],
                                    ray[1],
                                    poly[j],
                                    poly[(j+1)%poly.length])
            if(touch){
                touches.push(touch)
            }
            }
        }
        //loop Check for intersection with rays
        if(touches.length == 0){
            return null;
        }
        else{
            //pertty cool idea frist create a list of all offsets 
            const offsets=touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }

    }


    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle = lerp(
                this.RaySpread/2,
                -this.RaySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.car.angle;

            const start = {x:this.car.x,y:this.car.y}
            const end = {
                x:this.car.x-Math.sin(rayAngle)*this.RayLength,
                y:this.car.y-Math.cos(rayAngle)*this.RayLength
            };
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        for(let i = 0;i<this.rayCount;i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }

}