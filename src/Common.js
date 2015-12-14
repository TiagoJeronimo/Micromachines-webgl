function checkCollisions (obj1, obj2) {
	if(obj2.collisionsOn != null && obj2.collisionsOn == false) {}
	else {
	 	var checkBoxCar = obj1.checkBox //car
		var checkBoxObject = obj2.checkBox

		var dir = 1
		if (obj1.speed < 0)
			dir = -1
		else
			dir = 1

		var collides = false

		if ((checkBoxCar[0] >= checkBoxObject[0]) && (checkBoxCar[0] <= checkBoxObject[1]) && (checkBoxCar[3] >= checkBoxObject[2]) && (checkBoxCar[3] <= checkBoxObject[3])) {
			collides = true
		}

		else if ((checkBoxCar[1] >= checkBoxObject[0]) && (checkBoxCar[1] <= checkBoxObject[1]) && (checkBoxCar[3] >= checkBoxObject[2]) && (checkBoxCar[3] <= checkBoxObject[3])) {
			collides = true
		}

		else if ((checkBoxCar[0] >= checkBoxObject[0]) && (checkBoxCar[0] <= checkBoxObject[1]) && (checkBoxCar[2] >= checkBoxObject[2]) && (checkBoxCar[2] <= checkBoxObject[3])) {
			collides = true
		}

		else if ((checkBoxCar[1] >= checkBoxObject[0]) && (checkBoxCar[1] <= checkBoxObject[1]) && (checkBoxCar[2] >= checkBoxObject[2]) && (checkBoxCar[2] <= checkBoxObject[3])) {
			collides = true
		}
		//console.log("collides: " + collides)

		if (collides) {
			if(obj2.onCollisionMove != null && obj2.onCollisionMove == false) {}
			else {
				obj2.gameObject.setPosition(obj2.gameObject.position.x + car.direction[0]*0.03*dir, 
											obj2.gameObject.position.y, 
											obj2.gameObject.position.z + car.direction[2]*0.03*dir)
			}
		}
		return collides
	}
}


function multMatrixPoint(matrix, point, res) {
	for (var i = 0; i < 4; ++i) {

		res[i] = 0.0;
	
		for (var j = 0; j < 4; j++) {
		
			res[i] += point[j] * matrix[j*4 + i];
		} 
	}

}

var inputTimes = [{"time":1075,"key":"Q"},{"time":1748,"key":"P"},{"time":2328,"key":"P"},{"time":2844,"key":"P"},{"time":3567,"key":"P"},{"time":4271,"key":"P"},{"time":4777,"key":"P"},{"time":5611,"key":"P"},{"time":6329,"key":"P"},{"time":6776,"key":"P"},{"time":7400,"key":"P"},{"time":8150,"key":"P"},{"time":8826,"key":"P"},{"time":9322,"key":"P"},{"time":9847,"key":"P"},{"time":10387,"key":"P"},{"time":11147,"key":"P"},{"time":11673,"key":"P"},{"time":12099,"key":"Q"},{"time":12471,"key":"P"},{"time":13029,"key":"P"},{"time":13513,"key":"P"},{"time":14142,"key":"Q"},{"time":14444,"key":"O"},{"time":14907,"key":"Q"},{"time":15338,"key":"O"},{"time":15873,"key":"O"},{"time":16113,"key":"P"},{"time":16385,"key":"O"},{"time":16688,"key":"Q"},{"time":17119,"key":"O"},{"time":17645,"key":"O"},{"time":18393,"key":"Q"},{"time":19047,"key":"P"},{"time":19213,"key":"Q"},{"time":19756,"key":"Q"},{"time":19877,"key":"O"},{"time":20339,"key":"Q"},{"time":20866,"key":"Q"},{"time":21073,"key":"O"},{"time":21658,"key":"O"},{"time":22105,"key":"O"},{"time":22556,"key":"O"}]

var inputUpTimes = [{"time":2125,"key":"P"},{"time":2679,"key":"P"},{"time":2997,"key":"P"},{"time":3986,"key":"P"},{"time":4573,"key":"P"},{"time":5075,"key":"P"},{"time":6052,"key":"P"},{"time":6648,"key":"P"},{"time":6898,"key":"P"},{"time":7868,"key":"P"},{"time":8491,"key":"P"},{"time":8975,"key":"P"},{"time":9618,"key":"P"},{"time":10278,"key":"P"},{"time":10504,"key":"P"},{"time":11205,"key":"Q"},{"time":12115,"key":"P"},{"time":12620,"key":"P"},{"time":13221,"key":"P"},{"time":13469,"key":"Q"},{"time":14194,"key":"P"},{"time":14477,"key":"Q"},{"time":14966,"key":"O"},{"time":15524,"key":"O"},{"time":15662,"key":"Q"},{"time":16022,"key":"O"},{"time":16268,"key":"P"},{"time":16716,"key":"O"},{"time":17592,"key":"Q"},{"time":18326,"key":"O"},{"time":18899,"key":"Q"},{"time":19380,"key":"P"},{"time":19831,"key":"Q"},{"time":20697,"key":"O"},{"time":21180,"key":"O"},{"time":21813,"key":"O"},{"time":22367,"key":"O"},{"time":22438,"key":"Q"},{"time":22721,"key":"O"}]