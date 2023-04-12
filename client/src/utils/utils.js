import { statusOptions } from "../config";


export function jsonToOptionsSelectArray(rawJson) {
    // expect rawJson to be a json like
    // {
    //     "value1": "text1",
    //     "value2": "text2",
    //     ...
    // }
    // this funcition will convert that object into
    // [
    //     { value: "value1", text: "text1" },
    //     { value: "value2", text: "text2" },
    //     ...
    // ]

    const clonedJson = structuredClone(rawJson)
    const result = []
    for (const value in clonedJson) {
        result.push({ value: value, text: clonedJson[value] })
    }
    return result
}

export function getStatusOptionsForHtmlSelect() {
    return jsonToOptionsSelectArray(statusOptions)
}

export function getOptionsFromApolloUseQueryResponse(items, valueKey, textKey) {
    // expect items to be an array like
    // [
    //     {
    //         id: 'id1',
    //         username: 'username1',
    //         email: 'email1'
    //     },
    //     ...
    // ]
    // if valueKey is 'id' and text 'email' it will return
    // [
    //     { value: 'id1', text: 'email1' },
    //     ...
    // ]
    const result = []
    for (const item of items) {
        result.push({ value: item[valueKey], text: item[textKey] })
    }
    return result
}

export function getQueryName(query) {
    // this works for gpl mutations and queries
    return query.definitions[0].name.value
}

export function capitalizeFirstLetter(string) {
    // credit to 
    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getNewErrors(errors, inspectObject, requiredFields) {
    const errorsCopy = structuredClone(errors)
    for (const field of requiredFields) {
        errorsCopy[field] = false
        if (!inspectObject[field]) {
            errorsCopy[field] = {
                content: `Please enter a valid ${field}`,
                pointing: 'below',
            }
        }
    }
    return errorsCopy
}