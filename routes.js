var controller = require('./controller');

module.exports = [
    { method: 'POST', path: '/users/signup', config : controller.signup} ,
    { method: 'POST', path: '/users/login', config : controller.login },
	{ method: 'POST', path: '/users/', handler : controller.saveUser, config : {auth : 'tokenBased'} },
    { method: 'GET', path: '/users/{id}', handler : controller.getUser, config : {auth : 'tokenBased'} },
	{ method: 'POST', path: '/users/search', handler : controller.searchUser, config : {auth : 'tokenBased'} },
    { method: 'POST', path: '/users/logout', handler : controller.logout }
];