

import React from 'react'
import { ManagerContext } from "../Manager/index.js"


function Clipping(props) {
  const [ state,  ] = React.useContext(ManagerContext)
  return (
    <img 
      src={props.clipping_data.imageURI.replace("/800/", "/200/" )}
      style={{
          width: `${200 * state.options.scale.dropping}px`,
          height: `${200 * state.options.scale.dropping}px`
      }}
      alt={""}
    />
  )
  

}
export default Clipping;

