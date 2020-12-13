const { createParamToError } = require('../common/common');

module.exports = {
    logErrors: (err, req, res, next) => {
        console.error(err.err.stack);
        next(err);
    },

    errorHandler: (err, req, res, next) => {
        res.status(err.status || 500);
        const params = err.params || {};
        
        res.render(err.renderPage, {
            ...params,
            errorMessages: createParamToError(err.errorMessages)
        });
    }
}