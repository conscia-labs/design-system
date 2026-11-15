import * as React from "react";

/** True inside a Field. Base UI's field parts throw outside one, so parts check this first. */
const InsideFieldContext = React.createContext(false);

export { InsideFieldContext };
