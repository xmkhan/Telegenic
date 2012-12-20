/*
	getting sample video pages
*/

exports.video = function (req, res) {
    res.render('video', { title: 'IO.' });
};

exports.video2 = function (req, res) {
    res.render('video2', { title: 'IO.' });
};