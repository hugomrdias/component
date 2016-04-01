'use strict';
var ActionTypes = exports.actionsTypes = {
    VALIDATE_FORM: 'VALIDATE_FORM'
};
var t = require('tcomb-validation');
var validate = t.validate;

function mysubtype(type, getValidationErrorMessage, name) {
    var Subtype = t.subtype(type, function(x) {
        return !t.String.is(getValidationErrorMessage(x));
    }, name);

    Subtype.getValidationErrorMessage = getValidationErrorMessage;
    return Subtype;
}

var NameType = mysubtype(t.String, function(s) {
    if (!s) {
        return 'Required';
    }
    if (s.length >= 3) {
        return 'Too long my friend';
    }
});
var EmailType = mysubtype(t.String, function(s) {
    if (!s) {
        return 'Required';
    }
    if (s.length <= 4) {
        return 'Not an email!!';
    }
});

var Schema = t.struct({
    name: NameType,
    email: EmailType,
    age: t.Number
});
exports.validate = function(store, e) {
    e.preventDefault();
    var result = validate({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: Number(document.getElementById('age').value.trim())
    }, Schema);

    store.dispatch({
        type: ActionTypes.VALIDATE_FORM,
        values: result
    });
};

exports.reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = {
            errors: [],
            values: {
                name: '',
                email: '',
                age: ''
            },
            message: ''
        };
    }
    switch (action.type) {
        case ActionTypes.VALIDATE_FORM:
            return Object.assign({}, state, {
                errors: action.values.errors,
                values: action.values.value
            });
        default:
            return state;
    }
};
