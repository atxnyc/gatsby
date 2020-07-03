/** @jsx jsx */
import { jsx } from "theme-ui"
import React, { forwardRef, useState, useEffect, useRef } from "react"
import hex2rgba from "hex2rgba"

import LayerTab from "./layer-tab"
import { mediaQueries } from "gatsby-design-tokens/dist/theme-gatsbyjs-org"

const ExampleWrapper = ({ children }) => (
  <div
    sx={{
      gridArea: `example`,
      borderRadius: 2,
      overflow: `auto`,
    }}
  >
    {children}
  </div>
)

const LayerContentWrapper = ({
  index,
  displayCodeFullWidth = false,
  children,
}) => (
  <div
    id={`tabpanel${index}`}
    aria-labelledby={`tab${index}`}
    role="tabpanel"
    sx={{
      pt: 4,
      px: 0,
      display: `grid`,
      gridTemplateRows: `repeat(2, auto)`,
      gridTemplateAreas: `"content" "example"`,
      gridGap: 2,
      [mediaQueries.lg]: {
        gridTemplateRows: displayCodeFullWidth ? `repeat(2, auto)` : `1fr`,
        gridTemplateColumns: displayCodeFullWidth ? `auto` : `repeat(2, 1fr)`,
        gridTemplateAreas: displayCodeFullWidth
          ? `"content" "example"`
          : `"example content"`,
        gridGap: 6,
      },
      "& p:last-child": {
        mb: 0,
      },
    }}
  >
    {children}
  </div>
)

export default function LayerModel({
  layers,
  displayCodeFullWidth = false,
  initialLayer = `Content`,
}) {
  const [selected, setSelected] = useState(initialLayer)
  const refs = useRef(layers.map(() => React.createRef()))
  const currentIndex = layers.findIndex(layer => layer.title === selected)

  function downHandler({ key }) {
    if (key === `ArrowLeft` && currentIndex !== 0) {
      const targetIndex = currentIndex - 1
      setSelected(layers[targetIndex].title)
      refs.current[targetIndex].current.focus()
    }
    if (key === `ArrowRight` && currentIndex !== layers.length - 1) {
      const targetIndex = currentIndex + 1
      setSelected(layers[targetIndex].title)
      refs.current[targetIndex].current.focus()
    }
  }

  useEffect(() => {
    window.addEventListener(`keydown`, downHandler)
    return () => {
      window.removeEventListener(`keydown`, downHandler)
    }
  }, [selected])

  const { example, text } = layers[currentIndex]

  return (
    <div
      sx={{
        borderRadius: 3,
        border: t => `1px solid ${t.colors.ui.border}`,
        padding: 2,
        marginBottom: 6,
      }}
    >
      <div
        sx={{
          borderRadius: 3,
          backgroundColor: `ui.background`,
        }}
      >
        <div
          role="tablist"
          sx={{
            display: `grid`,
            gridTemplateColumns: `repeat(${layers.length}, 1fr)`,
            gridGap: 1,
            textAlign: `center`,
          }}
        >
          {layers.map((layer, index) => (
            <LayerTab
              key={index}
              ref={refs.current[index]}
              index={index}
              layer={layer}
              onClick={() => setSelected(layer.title)}
              selected={selected === layer.title}
            />
          ))}
        </div>
      </div>
      <LayerContentWrapper
        key={`contentWrapper${currentIndex}`}
        index={currentIndex}
        displayCodeFullWidth={displayCodeFullWidth}
      >
        <ExampleWrapper>{example}</ExampleWrapper>
        <div>{text}</div>
      </LayerContentWrapper>
    </div>
  )
}
