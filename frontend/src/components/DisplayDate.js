import React from "react";
import { getCurrentDate } from "../utils/date.js";

function DisplayDate() {
  return <div id="display-date">{getCurrentDate()}</div>;
}

export default DisplayDate;