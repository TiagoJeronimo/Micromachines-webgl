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

var inputTimes = [{"time":93,"key":"Q"},{"time":101,"key":"O"},{"time":122,"key":"P"},{"time":146,"key":"P"},{"time":171,"key":"Q"},{"time":192,"key":"P"},{"time":204,"key":"Q"},{"time":233,"key":"P"},{"time":258,"key":"P"},{"time":278,"key":"P"},{"time":323,"key":"P"},{"time":363,"key":"P"},{"time":395,"key":"P"},{"time":421,"key":"P"},{"time":450,"key":"P"},{"time":466,"key":"P"},{"time":486,"key":"P"},{"time":507,"key":"P"},{"time":546,"key":"P"},{"time":599,"key":"P"},{"time":655,"key":"P"},{"time":687,"key":"P"},{"time":716,"key":"P"},{"time":744,"key":"P"},{"time":779,"key":"P"},{"time":798,"key":"P"},{"time":820,"key":"P"},{"time":850,"key":"P"},{"time":882,"key":"P"},{"time":883,"key":"A"},{"time":906,"key":"O"},{"time":938,"key":"P"},{"time":981,"key":"P"},{"time":987,"key":"Q"},{"time":1019,"key":"Q"},{"time":1029,"key":"O"},{"time":1042,"key":"P"},{"time":1078,"key":"Q"},{"time":1088,"key":"P"},{"time":1115,"key":"O"},{"time":1137,"key":"Q"},{"time":1137,"key":"O"},{"time":1164,"key":"Q"},{"time":1187,"key":"O"},{"time":1236,"key":"Q"},{"time":1267,"key":"Q"},{"time":1270,"key":"O"},{"time":1304,"key":"P"}]
var inputUpTimes = [{"time":106,"key":"O"},{"time":128,"key":"P"},{"time":151,"key":"Q"},{"time":183,"key":"P"},{"time":194,"key":"Q"},{"time":206,"key":"P"},{"time":241,"key":"P"},{"time":265,"key":"P"},{"time":310,"key":"P"},{"time":337,"key":"P"},{"time":381,"key":"P"},{"time":415,"key":"P"},{"time":433,"key":"P"},{"time":456,"key":"P"},{"time":477,"key":"P"},{"time":496,"key":"P"},{"time":533,"key":"P"},{"time":561,"key":"P"},{"time":644,"key":"P"},{"time":659,"key":"P"},{"time":706,"key":"P"},{"time":731,"key":"P"},{"time":762,"key":"P"},{"time":789,"key":"P"},{"time":807,"key":"P"},{"time":837,"key":"P"},{"time":863,"key":"Q"},{"time":888,"key":"P"},{"time":936,"key":"O"},{"time":980,"key":"A"},{"time":1018,"key":"P"},{"time":1033,"key":"O"},{"time":1048,"key":"P"},{"time":1071,"key":"Q"},{"time":1094,"key":"P"},{"time":1105,"key":"Q"},{"time":1122,"key":"O"},{"time":1142,"key":"O"},{"time":1150,"key":"Q"},{"time":1186,"key":"Q"},{"time":1247,"key":"O"},{"time":1283,"key":"O"},{"time":1306,"key":"Q"},{"time":1311,"key":"P"}]