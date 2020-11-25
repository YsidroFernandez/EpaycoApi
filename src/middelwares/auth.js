'use strict'

const Service = require('../service')


function isAuth(req, resp, next) {
    if (!req.headers.authorization) {
        return resp.status(403).send({ message: 'Unauthorized' })
    }

    const token = req.headers.authorization.split(" ")[1]
    
    Service.decodeToken(token)
      .then(response => {
        req.user = response
      next()
      })
      .catch(response =>{
        resp.status(response.status)
      })
       
}

module.exports = isAuth