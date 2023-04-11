import { getOptionsFromApolloUseQueryResponse } from "./utils";
import { describe, it, expect } from "vitest";


const apolloUseQueryResponse = [
    {
        id: '123',
        username: 'username1'
    },
    {
        id: '321',
        username: 'username2'
    }
]

const expectedOptions = [
    { value: '123', text: 'username1' },
    { value: '321', text: 'username2' }
]

describe('test getOptionsFromApolloUseQueryResponse()', () => {
    it('should match expectedOptions', () => {
        expect(getOptionsFromApolloUseQueryResponse(
            apolloUseQueryResponse, 'id', 'username'
        )).toEqual(expectedOptions)
    })
})