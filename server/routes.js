module.exports = function (app, opts) {
    function ensureAuthenticated (request, response, next) {
      if (!request.userContext) {
        return response.status(401).redirect("/account/login");
      }
  
      next();
    }
  
    app.get("", (request, response, next) => {
      try{
        return response.render('../public/views/home.pug');
       } catch (error) {
        console.log(error)
       };
    });
  
    app.get('/dashboard', ensureAuthenticated, (request, response, next) => {
      return response.render('../public/views/dashboard.pug', {
        user: request.userContext.userinfo,
        rooms: opts.rooms
      });
    });
  
    app.get("/broadcast", ensureAuthenticated, (request, response, next) => {
  
      return response.render("../public/views/broadcaster.pug", {
        user: request.userContext.userinfo,
      });
    });
  
    app.get("/view/:room", ensureAuthenticated, (request, response, next) => {
      return response.render("../public/views/viewer.pug", {
        user: request.userContext.userinfo,
        room: request.params.room
      });
    });
  
    // app.get("/account/logout", ensureAuthenticated, (request, response, next) => {
    //   request.logout();
    //   response.redirect("");
    //   return response.render("../public/views/home.pug");
    // });
  
    app.get("/account/login", (request, response, next) => {
      return response.render("../public/views/home.pug");
    });
  };