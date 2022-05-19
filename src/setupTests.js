import React from 'react';
import { render } from '@testing-library/react';
import { DialogContext } from './contexts/DialogContext';
import { ConfigurationContext } from './contexts/ConfigurationContext';
import { isDefined } from './tools/helpers';
import { JssProvider, ThemeProvider } from 'react-jss';
import theme from '../public/override/theme.json';

export const contextName = {
  dialogContext: 'dialogContext',
  configurationContext: 'configurationContext',
  jssProvider: 'jssProvider',
  themeProvider: 'themeProvider',
};

const nameToContextProviderDefaultTestValue = {
  [contextName.configurationContext]: {
    reset: jest.fn,
    update: jest.fn,
    configuration: {},
  },
  [contextName.themeProvider]: { theme },
};

export class ContextQuery {
  static make(name, providerValue = {}, replace = false) {
    if (!contextName[name])
      throw new Error(`while creating context query: unknown name ${name}, check |contextName| object`);
    const defaultProviderValue = nameToContextProviderDefaultTestValue[name] || {};
    let value = { ...defaultProviderValue, ...providerValue };
    if (replace) value = providerValue;

    const contextQuery = { name, value };
    return contextQuery;
  }
}

export const nameToContextComponent = {
  [contextName.dialogContext]: DialogContext,
  [contextName.configurationContext]: ConfigurationContext,
  [contextName.jssProvider]: JssProvider,
  [contextName.themeProvider]: ThemeProvider,
};

/* recursive component nesting */
const nest = (list, Children) => {
  if (list.length > 0) {
    const query = list.pop();
    const { Provider, value } = query;
    if (!isDefined(Provider)) throw new Error(`No provider for ${name}`);
    const providerProps = value || {};
    return nest(list, <Provider {...providerProps}>{Children}</Provider>);
  }
  return Children;
};

const resolveQueryContextList = (queryContextList) => {
  return queryContextList.map((queryContext) => {
    const { name } = queryContext;
    const Context = nameToContextComponent[name];
    if (!isDefined(Context))
      throw new Error(`No context with name ${name}, please add it to |contextName| and |nameToContextComponent|`);
    const Provider = Context?.Provider || Context; // seems libraries straight provide Provider -.-

    const queryContextResolved = {
      ...queryContext,
      Context,
      Provider,
    };

    return queryContextResolved;
  });
};
const addAppUtilsQueryContextToList = (qcList = []) => {
  return [ContextQuery.make(contextName.jssProvider), ContextQuery.make(contextName.themeProvider)].concat(qcList);
};
const _render = (ui, options = { renderOptions: {}, contexts: [] }) => {
  const queryContextList = addAppUtilsQueryContextToList(options.contexts);
  const queryContextListResolved = resolveQueryContextList(queryContextList);
  return render(nest(queryContextListResolved, ui), options.renderOptions);
};

export { _render as render };

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();
