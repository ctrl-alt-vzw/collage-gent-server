

import React from 'react'

function Clipping(props) {
  return (
    <img 
      src={props.clipping_data.imageURI.replace("/800/", "/200/" )}
      style={{
        width: "200px",
        height: "200px"
      }}
      alt={""}
    />
  )
  

}
export default Clipping;

