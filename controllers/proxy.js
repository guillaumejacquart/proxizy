const App = require('../models/app');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer({
	changeOrigin: true,
	ignorePath: true,
	ws: true,
	cookieDomainRewrite: {
		//"test.localhost.tv" : "127.0.0.1"
	}
});

/**
 * GET *
 * Proxy.
 */
exports.index = (req, res, next) => {
	var domain = req.hostname;
	App.findOne({ $where: function () { 
		return (this.url && req.path.startsWith(this.url) !== -1)
			|| (this.domain && this.domain === domain); 
	}}, function(err, app){
		var isRelativeUrl = app && app.url && req.path.indexOf(app.url) !== -1;
		var isSubdomain = app && app.domain && domain == app.domain;
		
		if(!isRelativeUrl && !isSubdomain){
			return next();
		}
				
		if(app.restricted){	
			if(!req.user){
				return res.redirect('/proxizy/login');
			}
			
			var index = app.users.indexOf(req.user._id);
			if(index === -1 && !req.user.admin){
				req.flash('errors', [{msg: 'You are not allowed to access the website'}]);
				return res.redirect('/proxizy/login');
			}
		}	
		
		var proxyPath = req.url.replace(app.url, '');
		console.log('proxying to : ' + app.proxy + proxyPath + ' with HTTP ' + req.method);
		apiProxy.web(req, res, {
			target: app.proxy + proxyPath
		}, function(e) { 
			res.render('proxy/error', {
				title: 'Proxy error',
				error: e
			});
		});
	});
};