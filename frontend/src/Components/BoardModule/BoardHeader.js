import React, { useState } from "react";
import "../../Main.css";

function BoardHeader({ boardName, colorBg }) {
  const style_circle = {
    background: colorBg,
  };

  return (
    <div className="boardheader">
      <div className="boardheader__body">
        <div className="titlebody">
          <div className="circle" style={style_circle}></div>
          <p>{boardName}</p>
        </div>
      </div>
    </div>
  );
}

export default BoardHeader;
