import _ from "lodash";
import React from "react";

import ListeningView from "../listening_view.js";

class DecimalReadout extends ListeningView {
  render() {
    let formatted;

    if (typeof this.state.data === "undefined" || this.state.data.length === 0) {
      formatted = "-";

    } else {
      if (typeof this.props.quaternionId !== "undefined") {
        formatted = this.state.data[0][this.props.eulerAxis];

      } else if (this.state.data.length > 1) {
        formatted = _.max(this.state.data, "t").v;

      } else {
        formatted = this.state.data[0].v;
      }

      if (typeof this.props.conversion !== "undefined") {
        formatted *= parseFloat(this.props.conversion);
      }

      if (typeof this.props.scale !== "undefined") {
        formatted = formatted.toFixed(this.props.scale);

      } else {
        formatted = formatted.toString();
      }

      if (typeof this.props.precision !== "undefined") {
        const integer = parseInt(formatted);
        const padded = _.padLeft(integer, this.props.precision, "0");
        formatted = formatted.replace(new RegExp("^" + integer), padded);
      }

      if (this.props.negativePad === "true") {
        formatted = formatted.replace(/^([^\-])/, "\u00A0$1");
      }
    }

    return <span>{formatted}</span>;
  }
}

export {DecimalReadout as default};
