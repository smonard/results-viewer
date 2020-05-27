import React from "react"
import "./button.css"

const Button = props => {
  const style = props.style || {}
  const className = props.className || "button"

  return <button className={className} type="submit" style={style} {...props} />
}

export default Button