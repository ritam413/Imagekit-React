import React from 'react'

const contraintToBoudary = (obj,img)=>{
    gW = img.getScaledWidth();
  const imgH = img.getScaledHeight();

  // 1. Position constraints (Left & Top)
  if (obj.left < img.left) obj.left = img.left;
  if (obj.top < img.top) obj.top = img.top;

  // 2. Size/Position constraints (Right & Bottom)
  if (obj.left + width > img.left + imgW) {
    obj.left = img.left + imgW - width;
  }
  if (obj.top + height > img.top + imgH) {
    obj.top = img.top + imgH - height;
  }

  // 3. Prevent the crop box itself from being larger than the image
  if (width > imgW) obj.set('scaleX', imgW / obj.width);
  if (height > imgH) obj.set('scaleY', imgH / obj.height);

//   obj.setCoords();
}

export {contraintToBoudary}
