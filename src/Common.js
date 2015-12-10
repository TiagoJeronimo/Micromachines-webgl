function checkCollisions (obj1, obj2) {

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
		obj2.gameObject.setPosition(obj2.gameObject.x + car.direction[0]*0.000003*dir, 
									obj2.gameObject.y, 
									obj2.gameObject.z + car.direction[2]*0.000003*dir)
	}
	// return collides
}