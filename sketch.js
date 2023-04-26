let drawing = false;
let menubar;
let currentColor;
let scrollAmount = 0;
function setup() {
	createCanvas(windowWidth, windowHeight - 3.7);
	menubar = new Menu();
	menubar.createBucket(color(255, 0, 0))
	menubar.createBucket(color(0, 255, 0))
	menubar.createBucket(color(255, 0, 255))
	menubar.createBucket(color(255, 255, 0))
	menubar.createBucket(color(0, 255, 255))
	menubar.createBucket(color(255, 255, 255))


	//the current color we are drawing with
	currentColor = color(255)
}



let allPoints = [];
let points = [];


function draw() {
	background(0);
	push()
	translate(0, scrollAmount)
	drawPoints();
	pop()
	menubar.run()
}


class Menu {
	constructor(){
	this.loc = createVector(0, 0)
	this.buckets = [];
	this.eraser = createVector(20, 20)
	}
	display(){
		noStroke()
		fill(80)
		rect(this.loc.x, this.loc.y, 100, height)
	}
	createBucket(color){
		let bucketX = 50;
		let bucketY = 150 + 100 * this.buckets.length;
		let bucket = createVector(bucketX, bucketY);
		bucket.color = color;
		bucket.radius = 25;
		this.buckets.push(bucket);
	}
	displayBuckets(){
		for(let i = 0; i < this.buckets.length; i++){
			fill(this.buckets[i].color);
			ellipse(this.buckets[i].x, this.buckets[i].y, this.buckets[i].radius * 2);
		}
	}
	displayEraser(){
		fill(226, 174, 180);
		rect(this.eraser.x, this.eraser.y, 60, 60, 10)
	}
	runEraser(){
		for(let i = 0; i < allPoints.length; i++){
			for(let o = 0; o < allPoints[i].length; o++){
				 if(dist(mouseX, mouseY - scrollAmount, allPoints[i][o].x, allPoints[i][o].y) < 10){
				 	 allPoints.splice(i, 1);
				 }
			}
		}
	}

	run(){
		this.display();
		this.displayBuckets();
		this.displayEraser();
		if(currentColor == 'eraser' && drawing){
			this.runEraser();
		}
	}
}




const drawPoints = () => {
	// stroke(color);
	strokeWeight(3);

	//draw all the previous drawings
	for(let i = 0; i < allPoints.length; i++){
		let prevPoint;
		for(let o = 0; o < allPoints[i].length; o++){
			let currentPoint = allPoints[i][o];
			if(prevPoint){
				stroke(allPoints[i].color);
				line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
			}
			prevPoint = currentPoint;
		}

	}

	if(drawing && currentColor != 'eraser'){
		let mouse = createVector(mouseX, mouseY - scrollAmount)
		points.push(mouse)

	//draw the current drawing stroke
	for(let i = 0; i < points.length; i++){
		//skip first iteration
		if(i == 0){
			stroke(currentColor)
		} else if (i == points.length-1){
			//the last element is a color, so we want to skip it
			continue
		}else{
			line(points[i-1].x,points[i-1].y,points[i].x,points[i].y);
		}
	}
}
}


function mousePressed(){
	if(dist(mouseX, mouseY, menubar.eraser.x + 30, menubar.eraser.y + 30) < 30){
		currentColor = 'eraser'
	}
		for(let i = 0; i < menubar.buckets.length; i++){
			if(dist(mouseX, mouseY, menubar.buckets[i].x, menubar.buckets[i].y) < menubar.buckets[i].radius){
				currentColor = menubar.buckets[i].color;
			}
		}
			drawing = true;
}
function mouseReleased(){
	drawing = false;
	points.color = currentColor;
	allPoints.push(points);
	points = [];
}

function mouseWheel(event){
	//if scrolling down
	if(event.delta > 0 || scrollAmount < 0){
		scrollAmount -= event.delta / 2
		//if scrolling up
	}
}
function keyPressed(){
	if(keyCode == 27){
		allPoints = []
	}
}
