export const getEmailDomain = (email) => {
  var regex = /@(.+?)\./; 
  var match = email.match(regex);
  var domain = match ? match[1] : null;
  return domain;
}

export const setGTMEvent = ({event, tag, subtag, userId = null, ...optional}) => {
  const metrics = {
    event, 
    tag, 
    subtag, 
    ...optional
  }
  const user_id = userId ? getEmailDomain(userId) : null;
  if (user_id) {
    metrics['user_id'] = user_id;
  }
  window?.dataLayer.push(metrics)
}