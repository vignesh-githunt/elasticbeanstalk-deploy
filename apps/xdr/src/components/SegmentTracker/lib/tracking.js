let analytics = window.analytics;
export const trackingManager = () => {
  
  function track (eventName, ...params) {
    analytics.track(eventName, {
      ...params
    })
  }
  
function identify(userId='',fullName='',email=''){
  analytics.identify(userId, {
    name: fullName,
    email: email
  });
}

function page(category, ...params){
  analytics.page(category, {
    ...params
  });
}

function group(groupId, ...params){
  analytics.group(groupId, {
    ...params
  });
}

function alias(userId, ...params){
  analytics.alias(userId, {
    ...params
  });
}

  return {
    track,
    identify,
    page,
    group,
    alias
  }
}
