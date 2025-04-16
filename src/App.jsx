import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { MapTool } from './components/MapTool.tsx'
import { MapShapeUtil } from './components/MapShape'
import { components, uiOverrides } from './components/ui-overrides.tsx'

// Define these outside the component to prevent recreation on each render
const customShapeUtils = [MapShapeUtil]
const customTools = [MapTool]

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={customShapeUtils}
        tools={customTools}
        overrides={uiOverrides}
        components={components}
      />
    </div>
  )
}