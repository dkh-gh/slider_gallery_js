
var slider;
document.addEventListener('DOMContentLoaded', init);

function init() {
	
	slider1 = new SliderGallery(
		document.querySelector('#slider1')
	);

	slider2 = new SliderGallery(
		document.querySelector('#slider2')
	);
	slider2.configure({
    'slide_poses_count': 3,
    'slide_max_rot_angle': 0,
    'slide_min_scale': .6,
    'transition': .75,
	});

	slider3 = new SliderGallery(
		document.querySelector('#slider3')
	);
	slider3.configure({
    'slide_poses_count': 3,
    'slide_max_rot_angle': 110,
    'slide_min_scale': .5,
    'reverse_rotation': true,
    'perspective': 750,
    'transition': .5,
	});

}
