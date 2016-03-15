import { createRenderer } from 'react-addons-test-utils';


/**
 * Shallowly renders a component for testing.
 * 
 * @param  {ReactElement} componentInstance
 * @return {ReactElement}
 */
export function shallowRender(componentInstance) {
  let renderer = createRenderer();
  renderer.render(componentInstance);
  return renderer.getRenderOutput();
}
