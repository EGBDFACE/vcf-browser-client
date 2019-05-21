import * as React from 'react';
import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import TableFrame from '../../src/components/TableFrame';

enzyme.configure({
    adapter: new Adapter()
});

test('Jest-React-TypeScript 尝试运行', () => {
  const renderer = enzyme.shallow(<div>hello world</div>);
  expect(renderer.text()).toEqual('hello world') // Pass
})
