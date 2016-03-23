using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using FoodieApi.Models;

namespace FoodieApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LoginController : ApiController
    {
        LoginModels md = new LoginModels();
        public LoginObjectGet_ResponseWrapper Get(string publicKey, string fbid)
        {
            LoginObjectGet_ResponseWrapper response = new LoginObjectGet_ResponseWrapper();
            if (publicKey == "$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$")
            {
                response.isAuthorized = true;
                response.result = md.loginWithFacebook(fbid);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public LoginObject_ResponseWrapper PostLoginAccount(LoginObject_Request obj)
        {
            LoginObject_ResponseWrapper response = new LoginObject_ResponseWrapper();
            if (obj.publicKey == "$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$")
            {
                response.isAuthorized = true;
                response.result = md.requestForApiKey(obj.username, obj.password);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }



        public LoginObjectPut_ResponseWrapper Put(LoginObjectPut_Request obj)
        {
            LoginObjectPut_ResponseWrapper response = new LoginObjectPut_ResponseWrapper();
            if (obj.publicKey == "$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$")
            {
                response.isAuthorized = true;
                response.result = md.forgotPassword(obj.username, obj.user_email);
            }
            else
            {
                response.isAuthorized = false;
                response.result = 3;
            }
            return response;
        }
        
    }
}
