import _ from "lodash";
import Chai from "chai";
import Flummox from "flummox";
import jsdom from "jsdom";

import HistoricalStore from "../../../../client/stores/historical_store";
import TelemetryActions from "../../../../client/actions/telemetry_actions";

const assert = Chai.assert;

describe("IntegerReadout", () => {
  let React;

  let action;
  let factory;
  let store;

  const payload = [{t: 0, v: 97816348761234}];

  beforeEach((done) => {
    jsdom.env("<!doctype html><html><body></body></html>", (e, window) => {
      Object.assign(global, _.pick(window, "document", "navigator"));
      global.window = window;
      window.console = global.console;

      // React does DOM interaction while it's being loaded, so it and
      // anything that depends on it can't be imported until after the DOM
      // is available, i.e., it is incompatible with ES6 import outside
      // the browser.
      React = require("react");
      const IntegerReadout = require(
        "../../../../client/views/readouts/integer_readout.jsx"
      );

      const app = new Flummox();

      action = app.createActions("test", TelemetryActions);
      store = app.createStore("test", HistoricalStore, action.relay);
      factory = React.createFactory(IntegerReadout)({store: store});

      done();
    });
  });

  const wrapped = (value) => {
    return new RegExp(`<span[^>]*>${value}</span>`);
  };

  it("renders data received before mounting", () => {
    action.relay(payload);
    React.render(factory, document.body);

    assert.match(document.body.innerHTML, wrapped(payload[0].v));
  });

  it("renders data received after mounting", () => {
    React.render(factory, document.body);
    action.relay(payload);

    assert.match(document.body.innerHTML, wrapped(payload[0].v));
  });

  it("rounds decimals", () => {
    React.render(factory, document.body);
    action.relay([{t: 0, v: 10.6}]);

    assert.match(document.body.innerHTML, wrapped(11));
  });

  it("renders a dash when it doesn't have data", () => {
    React.render(factory, document.body);
    assert.match(document.body.innerHTML, wrapped("-"));
  });

});
