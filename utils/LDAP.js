const ActiveDirectory = require("activedirectory");


function loginUserAD(username, password) {
  return new Promise((resolve, reject) => {
    const config = {
      url: "LDAP://vwkipco-adsvr01.libertycolombia.com/CN=Users,DC=libertycolombia,DC=com",
      baseDN: "DC=libertycolombia,DC=com"
    }
    var ad = new ActiveDirectory(config);
    const domain = "co-liberty\\";
    var usernameDomain = domain + username;
    var fail_found;

    ad.authenticate(usernameDomain, password, function (err, auth) {
      if (err) {
        console.log('ERROR: LDAP' + JSON.stringify(err));
        console.log('ERROR: LDAP includes("data 775")' + JSON.stringify(err).includes("data 775"));
        fail_found = err;
        reject(fail_found);        
      }

      if (auth) {
        console.log('Authenticated! --> ' + username);
        resolve(true);
      } else {
        console.log('NOAuthenticated! --> ' + username);
        resolve(false)
      }
    });
  });
}



module.exports = loginUserAD;




