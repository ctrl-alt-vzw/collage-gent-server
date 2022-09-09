import React, { useRef, useEffect, useState } from 'react'

const getPixelRatio = context => {
    var backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    
    return (window.devicePixelRatio || 1) / backingStore;
};
 
const Canvas = props => {
  
  const canvasRef = useRef(null)
  const [ annotationImage, setAnnotationImage] = React.useState(null)


// load image
  React.useEffect(() => {
    const imageElement = new Image();   // Create new img element
    imageElement.addEventListener('load', () => {    
      imageElement.setAttribute('crossorigin', 'anonymous'); // works for me
      setAnnotationImage(imageElement);
      console.log("loaded")
    }, false);
    imageElement.src = props.imageuri; // Set source path
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    //Our first draw


    let ratio = getPixelRatio(ctx);
    let width = getComputedStyle(canvas)
        .getPropertyValue('width')
        .slice(0, -2);
    let height = getComputedStyle(canvas)
        .getPropertyValue('height')
        .slice(0, -2);
       
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;



    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    console.log(props)
    if(annotationImage) {
      console.log("drawing image")
      const scaleFactor = canvas.width / annotationImage.width;
      const offsetY = -((annotationImage.height * scaleFactor) - canvas.height) / 2
      ctx.drawImage(annotationImage, 0, offsetY, annotationImage.width * scaleFactor, annotationImage.height * scaleFactor)
    }

    // if (this.cutting) {
    //   ctx.globalCompositeOperation = 'destination-in';
    // } else {
    //   ctx.globalCompositeOperation = 'multiply';
    // }

    // // draw image
    // this.calculateCircumference();    
    // this.drawOutline();

    // if(options.show.touchHistory && !this.cutting) {
    //   this.touchpoints.forEach((t) => {
    //     ctx.beginPath();
    //     ctx.rect(t.x, t.y, 10, 10);
    //     ctx.stroke();

    //     ctx.fillStyle = "red"
    //     ctx.beginPath();
    //     ctx.rect(this.centerpoint.x, this.centerpoint.y, 10, 10);
    //     ctx.fill();
    //   })
    // }

    // this.drawHiddenNormal() 

  }, [annotationImage])
  
  return <canvas id="canvas" ref={canvasRef} {...props}/>
}

export default Canvas