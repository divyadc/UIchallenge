import ListComponent from "./index.js";
import React from 'react';
import { shallow } from 'enzyme';

describe('ListComponent', () => {
    it('Should render correctly in "debug" mode', () => {
        const component = shallow(<ListComponent debug />);
        expect(component).toMatchSnapshot();
    });

    it('ButtonClickEvent', () => {
        const mockCallBack = jest.fn();
        const button = shallow((<button onClick={mockCallBack}>Show More</button>));
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });

    // it('Check Search Data', () => {
    //     const listComponent = new ListComponent();
    //     let result = jest.fn(() => {
    //         return Promise.resolve(listComponent.getSearchData("sea", 1));
    //     });
    //     expect(result.mock.instances.length).toBeGreaterThanOrEqual(1);
    // })
});

