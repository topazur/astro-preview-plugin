import React, { useState } from 'react'

export default function Demo(props: any) {
  const { propA, children, ...resetProps } = props

  const [count, setCount] = useState(1)

  return (
    <div {...resetProps}>
      <p>ReactPropA: {propA}</p>
      <p>ReactChildren: {children}</p>
      <p>ReactCount: {count}</p>
      <button onClick={() => setCount(v => v + 1)}>
        &nbsp;+1&nbsp;
      </button>
    </div>
  )
}
