addEventListener('DOMContentLoaded', function () {
	pickmeup('.single', {
		flat : true
	});

	var plus_5_days = new Date;
	plus_5_days.setDate(plus_5_days.getDate() + 5);
	pickmeup('.three-calendars', {
		flat      : true,
		date      : [
			new Date,
			plus_5_days
		],
		mode      : 'range',
		calendars : 3
	});
	pickmeup('input', {
		position       : 'right',
		hide_on_select : true
	});

	var element = document.getElementById("sg");

	pickmeup(element);
	element.addEventListener('pickmeup-change', function (e) {

	    // console.log(e.detail.formatted_date); // New date according to current format
	    // console.log(e.detail.date);   

	    var startDate = new Date('Sun Nov 12 2018 00:00:00 GMT+0700');

		var endDate   = e.detail.date
		var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

		var distantByDay =  seconds/86400
		console.log(distantByDay + " day")

		if (distantByDay < 0){

			document.getElementById("result").innerHTML = "Vui lòng chọn ngày sau 11/10" ;
			return;
		}

		var distantByWeek = Math.floor(distantByDay/7) //lam tron xuong
		console.log(distantByWeek + " week")

		var check = distantByWeek%3
		console.log("Value: " +  check )

		if (check == 0) {

			
			document.getElementById("result").innerHTML = "Ngày " + e.detail.formatted_date + "<br> Phòng: Tuyến | Kim Anh" ;

		} else if (check == 1) {

			document.getElementById("result").innerHTML = "Ngày " + e.detail.formatted_date + "<br> Phòng: Nhất | Huy" ;

		} else {

			document.getElementById("result").innerHTML = "Ngày " + e.detail.formatted_date + "<br> Phòng: Độ | Quân" ;

		}

	    
	})


});


