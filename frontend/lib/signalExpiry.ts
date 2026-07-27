export function getSignalExpiry() {

  return new Date(
    Date.now() + 15 * 60 * 1000
  );

}

export function isSignalExpired(
  expiry: Date
) {

  return new Date() > expiry;

}