const emailValidationRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
const passwordValidationRegexp = new RegExp(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/);

const validatePassword = (password) => {
    let error;

    if (!password) {
        return error = "Lacking password";
    } else if (password.length < 6) {
        return error = "Password is too short"
    } else if (!passwordValidationRegexp.test(password)) {
        return error = "Invalid password"
    }
};

const validateEmail = (email) => {
    let error;

    if (!email) {
        return error = "Lacking email";
    } else if (!emailValidationRegex.test(email)) {
        return error = "Invalid email"
    }
};

const validateName = (name) => {
    let error;

    if (!name) {
        return error = "Lacking name"
    }
};

const validate = (values) => {

    let errors = {
        email: "",
        password: "",
        name: ""
    }

    const validators = {
        email: (value) => {
            errors.email = validateEmail(value)
        },
        password: (value) => {
            errors.password = validatePassword(value)
        },
        name: (value) => {
            errors.name = validateName(value)
        }
    }

    Object.keys(values).forEach(
        key => validators[key] && validators[key](values[key])
    );

    return errors;
}

export default validate;