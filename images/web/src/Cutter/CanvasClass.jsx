
import React from 'react'
import Tooltip from './../Common/Tooltip'

const API_URL = "api.datacratie.cc";
const FILESTORE_URL = "media.datacratie.cc";

const protocol = "https"
const options = {
  show: {
    touchHistory: true,
    radiusLines: false
  },
  minimumRadia: 30,
  slack: 30,
  eraserStrength: 5
}

export default class CanvasClass extends React.Component {
  constructor(props) {
    super(props)
    this.mouseDown = false;
    this.touchpoints = [];
    this.outlinePoints = [];
    this.framerate = 20;
    this.cutting = false;
    this.erasing = false;
    this.imageURI = props.imageuri;

  }
  render() {
    return (
      <>
        <Tooltip message="draw around the object you want to cut out" />
        <div id="header">
          <button id="save" onClick={() => this.saveImage()}>Save</button>
          <button id="cut" onClick={() => { this.cutting = !this.cutting; this.update() }}>Preview</button>
          <button id="eraser" onClick={() => { this.erasing = !this.erasing; this.update() }}>Eraser</button>
          <button id="restart" onClick={() => {
            this.outlinePoints = []; 
            this.touchpoints = []; 
            this.cutting = false;
            this.update();
          }}>Restart</button>
        </div>
        <main>
          <div id="container">
            <canvas id="canvas" />
            <canvas id="normal_canvas"></canvas>
            <div id="hiddenCanvasContainer"></div>
          </div>
        </main>
      </>
    )
  }
  componentDidMount() {
    const c = document.getElementById("canvas");
    c.addEventListener("mousedown", () => this.mouseDown = true);
    c.addEventListener("mouseup", () => this.mouseDown = false);
    c.addEventListener("mousemove", (e) => this.mouseMoveHandler(e));
    c.addEventListener("touchstart", () => this.mouseDown = true, false);
    c.addEventListener("touchmove", (e) => this.mouseMoveHandler(e), false);
    c.addEventListener("touchend", () => this.mouseDown = false, false);
    
    c.width = window.innerWidth - 10;
    c.height = window.innerHeight - 10;

    const nc = document.getElementById("normal_canvas");
    nc.width = window.innerWidth - 10;
    nc.height = window.innerHeight - 10;

    this.loadImage()
    this.update();
    
  }

  update() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    if(this.img) {
      const scaleFactor = canvas.height / this.img.height;
      const offsetX = -((this.img.width * scaleFactor) - canvas.width) / 2
      ctx.drawImage(this.img, offsetX, 0, this.img.width * scaleFactor, this.img.height * scaleFactor)
    }

    if (this.cutting) {
      ctx.globalCompositeOperation = 'destination-in';
    } else {
      ctx.globalCompositeOperation = 'multiply';
    }

    // draw image
    this.calculateCircumference();    
    this.drawOutline();

    if(options.show.touchHistory && !this.cutting) {
      this.touchpoints.forEach((t) => {
        ctx.beginPath();
        ctx.rect(t.x, t.y, 10, 10);
        ctx.stroke();

        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.rect(this.centerpoint.x, this.centerpoint.y, 10, 10);
        ctx.fill();
      })
    }

    this.drawHiddenNormal() 
  }
  drawOutline() {
    if(this.outlinePoints.length > 0) {
      var c = document.getElementById("canvas");
      var ctx = c.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(this.outlinePoints[0].x, this.outlinePoints[0].y);
      this.outlinePoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      })

      ctx.closePath();
      ctx.fillStyle = "#aaaaff";
      ctx.fill();

    }
  }
  loadImage(url) {
    const img = new Image();   // Create new img element
    img.addEventListener('load', () => {    
      img.setAttribute('crossorigin', 'anonymous'); // works for me
      this.img = img;
      this.update();
      console.log("loaded")
    }, false);
    img.src = this.imageURI; // Set source path
  }
  calculateCircumference() {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    if(this.touchpoints.length > 0) {
      this.outlinePoints = [];
      let amount = Math.round(this.touchpoints.length / options.minimumRadia) + 1;
      if(amount < options.minimumRadia) { amount = options.minimumRadia; }
      // calc center
      const t = {x: 0, y: 0};
      for(let i = 0; i < this.touchpoints.length; i++) {
        t.x += this.touchpoints[i].x;
        t.y += this.touchpoints[i].y;
      }
      const centerX = Math.round(t.x / this.touchpoints.length);
      const centerY = Math.round(t.y / this.touchpoints.length);
      this.centerpoint = { x: centerX, y: centerY };
      for(let i = 0; i < 360; i+=(360 / amount)) {
        let max = 0;
        for(let j = 0; j < window.innerWidth / 2; j+=4) {
          const x = centerX + j * Math.sin(i *(Math.PI/180));
          const y = centerY + j * Math.cos(i *(Math.PI/180));
          
          let dist = window.innerWidth;
          for(let k = 0; k < this.touchpoints.length; k++) {
            const d = Math.sqrt( Math.pow((this.touchpoints[k].x-x), 2) + Math.pow((this.touchpoints[k].y-y), 2) );
            if(d < dist) { 
              dist = d; 
            }
          }
          
          if(dist < options.slack) {
             max = j;
          }

        }
        const x = centerX + max * Math.sin(i * (Math.PI/180));
        const y = centerY + max * Math.cos(i * (Math.PI/180));

        if(options.show.radiusLines) {
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.beginPath();
          ctx.rect(x, y, 5, 5);
          ctx.stroke();

          
        }
        if(max > 0) {
          this.outlinePoints.push({x, y });
        }
      }
      
    }
  }
  mouseMoveHandler(e) {
    const cur = {
      x: this.getCursorPosition(e).x,
      y: this.getCursorPosition(e).y
    };
    
    if(this.mouseDown) {

      if(!this.lastAddedTimestamp) { this.lastAddedTimestamp = new Date().getTime()}
      const t = new Date().getTime();
      if( (t - this.lastAddedTimestamp) > (1000 / this.framerate) ) {
        if(this.erasing) {
          for(let i = 0; i < this.touchpoints.length; i++) {
            const iter = this.touchpoints[i]
            const d = Math.sqrt( Math.pow((iter.x-cur.x), 2) + Math.pow((iter.y-cur.y), 2) );
            if(d < options.slack) {

              let angle = Math.atan2(iter.y - this.centerpoint.y, this.centerpoint.x - iter.x) * ( 180 / Math.PI );
              angle = angle < 0 ? angle + 360 : angle; 
              angle -= 90;
              const cd = Math.sqrt( Math.pow((this.centerpoint.x - iter.x), 2) + Math.pow((this.centerpoint.y - iter.y), 2) );

              console.log(angle , cd)

              const nx = this.centerpoint.x + (cd - options.eraserStrength) * Math.sin(angle * (Math.PI / 180));
              const ny = this.centerpoint.y + (cd - options.eraserStrength) * Math.cos(angle * (Math.PI / 180) );

              console.log(Math.round(nx), Math.round(ny))

              // this.touchpoints.splice(i, 1);
              this.touchpoints[i] = {x: nx, y: ny}
            }
          }
        } else {
            this.touchpoints.push(cur)
        }
        this.lastAddedTimestamp = t;
      }
      this.update();
    }
  }
  getCursorPosition(e) {
    const canvas = document.getElementById("canvas")
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y }
  }
  b64ToUint8Array(b64Image) {
    const img = atob(b64Image.split(',')[1]);
    const img_buffer = [];
    let i = 0;
    while (i < img.length) {
      img_buffer.push(img.charCodeAt(i));
      i++;
    }
    return new Uint8Array(img_buffer);
  }
  dataURLtoBlob(dataURL) {
    let array, binary, i, len;
    binary = atob(dataURL.split(',')[1]);
    array = [];
    i = 0;
    len = binary.length;
    while (i < len) {
      array.push(binary.charCodeAt(i));
      i++;
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }
  saveImage() {
    this.cutting = true; 
    this.update();
    const strMime = "image/png";
    const canvas = document.getElementById('canvas');
    const canvas_normal = document.getElementById("normal_canvas")
    // resize

    const startClippingX = this.outlinePoints.sort((a, b) => a.x - b.x)[0].x;
    const startClippingY = this.outlinePoints.sort((a, b) => a.y - b.y)[0].y;
    const clippingWidth = Math.round(this.outlinePoints.sort((a, b) => b.x - a.x)[0].x - startClippingX);
    const clippingHeight = Math.round(this.outlinePoints.sort((a, b) => b.y - a.y)[0].y - startClippingY);

    // image
    const hidden_canvas = document.createElement("canvas");
    const hidden_ctx = hidden_canvas.getContext('2d');    

    hidden_canvas.width = clippingWidth;
    hidden_canvas.height = clippingHeight;
    document.getElementById("hiddenCanvasContainer").insertAdjacentElement("beforeend", hidden_canvas)
    hidden_ctx.clearRect(0, 0, hidden_canvas.width, hidden_canvas.height);
    
    
    hidden_ctx.drawImage(
      canvas,
      startClippingX,
      startClippingY,
      clippingWidth,
      clippingHeight,
      0,
      0,
      clippingWidth,
      clippingHeight
    );


    const b64Image = hidden_canvas.toDataURL(strMime);
    const u8Image = this.dataURLtoBlob(b64Image);
    const formData = new FormData();
    formData.append("clipping", u8Image);

    // normalMap
    const normal_canvas = document.createElement("canvas");
    const normal_ctx = normal_canvas.getContext('2d');
    normal_canvas.width = clippingWidth;
    normal_canvas.height = clippingHeight;
    document.getElementById("hiddenCanvasContainer").insertAdjacentElement("beforeend", normal_canvas)
    
    normal_ctx.drawImage(
      canvas_normal,
      startClippingX,
      startClippingY,
      clippingWidth,
      clippingHeight,
      0,
      0,
      clippingWidth,
      clippingHeight
    );


    const normal_b64Image = normal_canvas.toDataURL(strMime);
    const normal_u8Image = this.dataURLtoBlob(normal_b64Image);
    formData.append("normal", new Blob([normal_u8Image], { type: strMime }));

    console.log(formData)
    fetch(`${protocol}://${FILESTORE_URL}/upload`, {
      method: 'POST',
      body: formData
    })
      .then(r => r.json())
      .then((data) => {
        console.log(data)
        const toSend = {
          imageURI: data["800"],
          normalURI: data["normal"],
          originID: "u",
          collection: "u",
          x: 10,
          y: 10,
          height: clippingHeight,
          width: clippingWidth
        }
        fetch(`${protocol}://${API_URL}/clipping`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(toSend)
        })
        .then(r=>r.json())
        .then((data) => {
          this.props.clippingcreated(data[0])
        })

      })
      .catch((e) => {
        console.log(e)
      })

  }
  drawHiddenNormal() {
    var canvas = document.getElementById('normal_canvas');
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if(this.outlinePoints.length > 0) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(this.outlinePoints[0].x, this.outlinePoints[0].y);

      this.outlinePoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      })

      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }


  }

}
