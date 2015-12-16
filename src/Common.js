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

function fullscreen() {
	console.log('oi')
	var i = document.getElementById("AVT-WebGL");

	// go full-screen
	if (i.requestFullscreen) {
		i.requestFullscreen();
	} else if (i.webkitRequestFullscreen) {
		i.webkitRequestFullscreen();
	} else if (i.mozRequestFullScreen) {
		i.mozRequestFullScreen();
	} else if (i.msRequestFullscreen) {
		i.msRequestFullscreen();
	}
}

var inputTimes = [{"time":98,"key":"Q"},{"time":107,"key":"P"},{"time":155,"key":"P"},{"time":186,"key":"P"},{"time":189,"key":"Q"},{"time":205,"key":"P"},{"time":223,"key":"P"},{"time":256,"key":"P"},{"time":274,"key":"Q"},{"time":279,"key":"P"},{"time":309,"key":"Q"},{"time":335,"key":"P"},{"time":372,"key":"P"},{"time":389,"key":"P"},{"time":413,"key":"Q"},{"time":432,"key":"Q"},{"time":446,"key":"P"},{"time":460,"key":"P"},{"time":512,"key":"P"},{"time":539,"key":"Q"},{"time":572,"key":"Q"},{"time":587,"key":"P"},{"time":603,"key":"P"},{"time":635,"key":"P"},{"time":661,"key":"Q"},{"time":684,"key":"P"},{"time":719,"key":"P"},{"time":740,"key":"Q"},{"time":762,"key":"O"},{"time":783,"key":"Q"},{"time":830,"key":"Q"},{"time":863,"key":"Q"},{"time":878,"key":"P"},{"time":927,"key":"O"},{"time":958,"key":"Q"},{"time":982,"key":"Q"},{"time":1007,"key":"O"},{"time":1042,"key":"O"},{"time":1061,"key":"Q"},{"time":1090,"key":"O"},{"time":1121,"key":"O"},{"time":1142,"key":"P"},{"time":1163,"key":"P"},{"time":1180,"key":"Q"},{"time":1189,"key":"O"},{"time":1206,"key":"O"},{"time":1218,"key":"Q"},{"time":1230,"key":"O"},{"time":1252,"key":"Q"},{"time":1265,"key":"O"},{"time":1272,"key":"Q"},{"time":1296,"key":"O"},{"time":1307,"key":"Q"},{"time":1318,"key":"O"},{"time":1340,"key":"P"},{"time":1369,"key":"P"},{"time":1396,"key":"O"},{"time":1414,"key":"O"},{"time":1443,"key":"O"},{"time":1470,"key":"O"},{"time":1494,"key":"O"},{"time":1516,"key":"O"},{"time":1542,"key":"O"},{"time":1573,"key":"O"},{"time":1610,"key":"O"},{"time":1658,"key":"O"},{"time":1693,"key":"O"},{"time":1724,"key":"P"}]
var inputUpTimes = [{"time":116,"key":"P"},{"time":175,"key":"Q"},{"time":191,"key":"P"},{"time":213,"key":"P"},{"time":229,"key":"P"},{"time":262,"key":"Q"},{"time":267,"key":"P"},{"time":285,"key":"Q"},{"time":316,"key":"P"},{"time":340,"key":"P"},{"time":379,"key":"P"},{"time":401,"key":"Q"},{"time":425,"key":"Q"},{"time":428,"key":"P"},{"time":453,"key":"P"},{"time":473,"key":"P"},{"time":518,"key":"Q"},{"time":552,"key":"P"},{"time":594,"key":"P"},{"time":616,"key":"Q"},{"time":665,"key":"P"},{"time":688,"key":"P"},{"time":721,"key":"Q"},{"time":754,"key":"P"},{"time":766,"key":"Q"},{"time":790,"key":"Q"},{"time":845,"key":"Q"},{"time":867,"key":"O"},{"time":889,"key":"P"},{"time":930,"key":"Q"},{"time":967,"key":"Q"},{"time":987,"key":"O"},{"time":1011,"key":"O"},{"time":1047,"key":"Q"},{"time":1073,"key":"O"},{"time":1108,"key":"O"},{"time":1127,"key":"O"},{"time":1147,"key":"P"},{"time":1174,"key":"Q"},{"time":1174,"key":"P"},{"time":1190,"key":"Q"},{"time":1198,"key":"O"},{"time":1220,"key":"O"},{"time":1227,"key":"Q"},{"time":1257,"key":"O"},{"time":1261,"key":"Q"},{"time":1283,"key":"O"},{"time":1298,"key":"Q"},{"time":1306,"key":"O"},{"time":1328,"key":"O"},{"time":1345,"key":"P"},{"time":1377,"key":"P"},{"time":1407,"key":"O"},{"time":1432,"key":"O"},{"time":1455,"key":"O"},{"time":1481,"key":"O"},{"time":1507,"key":"O"},{"time":1530,"key":"O"},{"time":1565,"key":"O"},{"time":1579,"key":"O"},{"time":1644,"key":"O"},{"time":1676,"key":"O"},{"time":1707,"key":"O"},{"time":1734,"key":"P"},{"time":1781,"key":"Q"}]