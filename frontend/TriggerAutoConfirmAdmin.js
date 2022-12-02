export const handler = (event, context, callback) => {
  event.response.autoConfirmUser = false;

  var role = event.request.userAttributes['custom:role'];
  
  if (role === 'ADMIN') {
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
  }

  // Return to Amazon Cognito
  callback(null, event);
};
