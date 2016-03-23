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
    public class PostDetailController : ApiController
    {
        PostDetailModels md = new PostDetailModels();
        FoodieToolSet fts = new FoodieToolSet();

        //GET BITE OR COMMENT OBJECTS
        public PostDetailObjectGet_ResponseWrapper Get(string api_key, int foodict_ID, int post_ID, int type)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            PostDetailObjectGet_ResponseWrapper response = new PostDetailObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getFoodicts(post_ID, foodict_ID, 0); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
    }
}
