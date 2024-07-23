// utils/firebaseErrors.js
export function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'The email address is already in use by another account.',
      'auth/invalid-email': 'The email address is not valid.',
      'auth/user-disabled': 'The user account has been disabled by an administrator.',
      'auth/user-not-found': 'There is no user record corresponding to this identifier. The user may have been deleted.',
      'auth/wrong-password': 'The password is invalid or the user does not have a password.',
      // Add more error codes and messages as needed
    };
  
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
  