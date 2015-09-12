var WebAPIUtils = require( './WebAPIUtils' )

module.exports = {
  login: function(email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    // pretendRequest(email, pass, (res) => {
    //   if (res.authenticated) {
    //     localStorage.token = res.token;
    //     if (cb) cb(true);
    //     this.onChange(true);
    //   } else {
    //     if (cb) cb(false);
    //     this.onChange(false);
    //   }
    // });
    if ( !!email && !!pass ){
      WebAPIUtils.login(email, pass, (res) => {
        if (res.authenticated) {
          localStorage.token = res.token;
          if (cb) cb(true);
          this.onChange(true);
        } else {
          if (cb) cb(false);
          this.onChange(false);
        }
      });
    }
  },

  getToken: function () {
    return localStorage.token;
  },

  logout: function (cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },

  onChange: function () {}
};

function pretendRequest(email, pass, cb) {
  setTimeout(() => {
    if (email === "tk421" && pass === "Changeme1") {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      });
    } else {
      cb({authenticated: false});
    }
  }, 0);
}
