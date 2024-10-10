/**
 * @jest-environment jsdom
 */
/* eslint-disable */
import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import FieldInfo from '../../../components/fieldInfo/fieldInfo';
import MintNFT from '../mintNFT';
// import axios from 'axios';
import * as store from '../../../store/store';

// const MockAdapter = require("axios-mock-adapter");
// const mock = new MockAdapter(axios);
describe('Mint NFT', () => {
    it('renders', () => {
        // const mockStore = jest.spyOn(store, 'useStore');  // spy on foo
        // mock.mockImplementation((arg: string) => [{user_id:10}]);
        // mock.onGet("/v1/user/1/assets?collectionsOwned=true").reply(200, {
        //     users: [{ id: 1, name: "John Smith" }],
        //   });
        const container = render(
            <MintNFT />,
        );
        // const container = render(
        //     <FieldInfo info='asdasd' />,
        // );
        expect(container).toMatchSnapshot();

        //   expect(queryByLabelText(/off/i)).toBeTruthy();

        //   fireEvent.click(getByLabelText(/off/i));

        //   expect(queryByLabelText(/on/i)).toBeTruthy();
    });
});
