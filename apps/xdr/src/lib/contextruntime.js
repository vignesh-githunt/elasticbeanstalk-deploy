import LocalStorageHelper from './localStorageHelper';
// import GoogleIntegration from 'google/ContextRuntimeIntegration';
// import BriskIntegration from 'brisk/ContextRuntimeIntegration';
// import dispatcher from './dispatcher';


const ContextRuntime = {
  setUser(user) {
    this.setContext(
      Object.assign({}, this.getContext(), {
        user: user,
      })
    );
  },
  setVersion(version) {
    this.setContext(Object.assign({}, this.getContext(), { version }));
  },
  setPusherInitCompleted() {
    this.setContext({...this.getContext(), pusherInitCompleted: true})
  },
  setAuth(token) {
    this.setContext(
      Object.assign({}, this.getContext(), {
        token: token,
      })
    );
  },
  setHostInfo(hostinfo) {
    this.setContext(Object.assign({}, this.getContext(), {
      host: hostinfo,
    }));
  },
  setHostUrl(url) {
    this.setContext(Object.assign({}, this.getContext(), { url }));
  },

  getContext() {
    return LocalStorageHelper.get('xdr_context') || {};
  },

  setContext(context) {
    LocalStorageHelper.set('xdr_context', context);
  },

  setPluginToken(pluginToken) {
    let context;
    if (!pluginToken) {
      return;
    }
    context = this.getContext();
    context.user = context.user || {};
    context.user.pluginToken = pluginToken;
    this.setContext(context);
  },

  getPluginToken() {
    let context = this.getContext();
    if(context.user) {
      return context.user.pluginToken
    }
    return ""
  },

  removePluginToken() {
    let context = this.getContext();
    if(context.user) {
      delete(context.user.pluginToken)
    }
    return ""
  }

};

export { ContextRuntime as default };
