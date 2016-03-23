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
    public class SignupController : ApiController
    {
        SignUpModels md = new SignUpModels();
        FoodieToolSet fts = new FoodieToolSet();

        public SignupObject_exist Get(string username)
        {
            return new SignupObject_exist()
            {
                result = md.isExistingUsername(username)
            };
        }

        public SignupObjectPost_ResponseWrapper Post(SignupObjectPost_Request obj)
        {
            SignupObjectPost_ResponseWrapper response = new SignupObjectPost_ResponseWrapper();
            if (obj.publicKey == "$K3uj3R!<@m|(@(h^aj^N3+W0Tw3n+Y14K3u$")
            {
                response.isAuthorized = true;
                response.result_code = md.signUpNow(obj);
            }
            else
            {
                response.isAuthorized = false;
                response.result_code = 0;
            }
            return response;
        }
    }
}
