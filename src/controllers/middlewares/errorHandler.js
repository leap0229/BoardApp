const { createParamToError } = require('../common/common');

module.exports = {
    logErrors: (err, req, res, next) => {
        if (err.err) {
            console.error(err.err);
        }
        next(err);
    },

    errorHandler: (err, req, res, next) => {
        res.status(err.status || 500);
        const params = err.params || {};
        const errorMessages = err.errorMessages || {};
        
        res.render(err.renderPage, {
            ...params,
            errorMessages: createParamToError(errorMessages)
        });
    }
}