import { mount, shallow } from 'enzyme';
import React from 'react';

import ChecklistItemInput from './ChecklistItemInput';
import Label from './Label';

describe('ChecklistItemInput', () => {
    it('renders children inside label', () => {
        const component = shallow(<ChecklistItemInput
            isSelected={ false }
            value="foobar_val"
            name="foobar"
        >
            children text
        </ChecklistItemInput>);

        expect(component.find(Label).dive().text())
            .toEqual('children text');
    });

    it('renders input as checked when is selected', () => {
        const component = shallow(<ChecklistItemInput
            isSelected={ true }
            value="foobar_val"
            name="foobar"
        />);

        expect(component.find('.form-checklist-checkbox').prop('checked'))
            .toBeTruthy();
    });

    it('renders input as unchecked when is not selected', () => {
        const component = shallow(<ChecklistItemInput
            isSelected={ false }
            value="foobar_val"
            name="foobar"
        />);

        expect(component.find('.form-checklist-checkbox').prop('checked'))
            .toBeFalsy();
    });

    it('calls onChange when input changes', () => {
        const onChange = jest.fn();
        const component = mount(<ChecklistItemInput
            isSelected={ true }
            value="foobar_val"
            onChange={ onChange }
            name="foobar"
        />);

        component.find('.form-checklist-checkbox').at(0)
            .simulate('change', { target: { value: 'foo', name: 'option' } });

        expect(onChange)
            .toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'foo', name: 'option' } }));
    });
});
