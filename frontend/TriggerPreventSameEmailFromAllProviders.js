const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = (event, context, callback) => {
  function checkForExistingUsers(event) {
    console.log("Executing checkForExistingUsers");
    var params = {
      UserPoolId: event.userPoolId,
      AttributesToGet: ['sub', 'email'],
      Filter: "email = \"" + event.request.userAttributes.email + "\""
    };

    return new Promise((resolve, reject) =>
      cognito.listUsers(params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (result && result.Users && result.Users[0] && result.Users[0].Username) {
          console.log("Found existing users: ", result.Users);
          if (result.Users.length > 1){
            result.Users.sort((a, b) => (a.UserCreateDate > b.UserCreateDate) ? 1 : -1);
            console.log("Found more than one existing users. Ordered by createdDate: ", result.Users);
            const err = new Error('Email existed')
            throw err;
          }
        } else {
          resolve(result);
        }
      })
    );

  }

  if (event.triggerSource == "PreSignUp_SignUp" || event.triggerSource == "PreSignUp_AdminCreateUser") {
    checkForExistingUsers(event).then(result => {
        if (result != null && result.Users != null && result.Users[0] != null) {
          console.log("Found at least one existing account with that email address: ", result);
          console.log("Rejecting sign-up");
          //prevent sign-up
          callback("An external provider account alreadys exists for that email address", null);
        } else {
          //proceed with sign-up
          callback(null, event);
        }
      })
      .catch(error => {
        console.log("Error checking for existing users: ", error);
        //proceed with sign-up
        callback(null, event);
      });

  }

  if (event.triggerSource == "PreSignUp_ExternalProvider") {

    checkForExistingUsers(event).then(result => {
      if (result != null && result.Users != null && result.Users[0] != null) {
        console.log("Found at least one existing account with that email address: ", result);
        console.log("Rejecting sign-up");
        //prevent sign-up
        callback("An external provider account alreadys exists for that email address", null);
      } else {
        //proceed with sign-up
        // event.response.autoConfirmUser = true;
        // event.response.autoVerifyEmail = true; 
        // event.request.userAttributes['custom:is_first_login'] = 'true'; 
        // event.request.userAttributes['custom:role'] = 'user';  
        // const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider({
        //   apiVersion: '2016-04-18',
        //   region: 'ap-southeast-1'
        // });
        // var params =  {
        //   UserAttributes: [
        //     {
        //         Name: "email_verified",
        //         Value: "true"
        //     },
        //     {
        //       Name: 'custom:is_first_login',
        //       Value: 'true'
        //     },
        //     {
        //       Name: 'custom:role',
        //       Value: 'user'
        //     }
        //   ],
        //   UserPoolId: event.userPoolId,
        // }

        // cognitoIdServiceProvider.adminUpdateUserAttributes(params, function(err, data) {
        //   if (err) {
        //         callback(null, event);
        //   } else {
        //         callback(null, event);
        //   }
        // });
          context.done(null, event);
          // callback(null, event);
        }
      })
      .catch(error => {
        console.log("Error checking for existing users: ", error);
        callback(null, event);
      });

  }
};
