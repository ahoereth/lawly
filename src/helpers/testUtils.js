import { createRenderer } from 'react-addons-test-utils';

/* eslint-disable import/prefer-default-export */

/**
 * Shallowly renders a component for testing.
 *
 * @param  {ReactElement} componentInstance
 * @return {ReactElement}
 */
export function shallowRender(componentInstance) {
  const renderer = createRenderer();
  renderer.render(componentInstance);
  return renderer.getRenderOutput();
}
