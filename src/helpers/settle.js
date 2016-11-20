export default function settle(promise) {
  return promise.then(
    value => ({ value, status: 'resolved' }),
    error => ({ error, status: 'rejected' }),
  );
}
