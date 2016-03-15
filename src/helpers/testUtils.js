import { createRenderer } from 'react-addons-test-utils';

export function shallowRender(componentInstance) {
  let renderer = createRenderer();
  renderer.render(componentInstance);
  return renderer.getRenderOutput();
}
