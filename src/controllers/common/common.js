module.exports = {
    createParamToError: (errors) => {
        const paramToError = {};

        if (!errors) {
            return;
        }
        
        errors.forEach((error) => {
            const errorMessage = error.msg;
            const param = error.param;

            if (param in paramToError) {
                paramToError[param].push(errorMessage);
            } else {
                paramToError[param] = [errorMessage];
            }
        });

        return paramToError;
    }
};