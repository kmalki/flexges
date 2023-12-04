import React from 'react';
import ProgressBar from "@ramonak/react-progress-bar";

export default function CustomProgressBar(props) {

  function perc2color(perc) {
    var r, g, b = 0;
    if (perc < 50) {
      r = Math.round(5.1 * perc);
      g = 255;
    }
    else {
      r = 255;
      g = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  const perc = (props.value * 100) / props.max;
  const color = perc2color(perc);

  return (
    <ProgressBar 
      completed={perc}
      bgColor={color}
      isLabelVisible={false}
    />
  );
}
